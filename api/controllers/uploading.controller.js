import Note from '../models/uploading.model.js'
import { errorHandler } from '../utils/error.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'
import https from 'https'

// Load environment variables
dotenv.config()

// Validate Cloudinary configuration
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('Missing Cloudinary configuration in environment variables')
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Test Cloudinary connection
cloudinary.api
  .ping()
  .then(() => console.log('✅ Cloudinary connected successfully'))
  .catch(err => console.error('❌ Cloudinary connection failed:', err))

// Configure multer with memory storage
const storage = multer.memoryStorage()

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]

  if (allowedTypes.includes(file.mimetype)) {
    console.log('Accepting file:', file.originalname, file.mimetype)
    cb(null, true)
  } else {
    console.log('Rejecting file:', file.originalname, file.mimetype)
    cb(
      new Error(
        'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed'
      ),
      false
    )
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
})

// Improved Cloudinary upload function
const uploadToCloudinary = async (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `notes/${Date.now()}-${path.parse(originalname).name}`,
        overwrite: true,
        format: path.extname(originalname).substring(1) || 'pdf'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          return reject(error)
        }
        console.log('Upload successful:', result.secure_url)
        resolve(result)
      }
    )

    uploadStream.end(fileBuffer)
  })
}

export const notesUploading = async (req, res, next) => {
  // Set proper CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Credentials', 'true')

  try {
    console.log('Request received with file:', req.file)
    console.log('Request body:', req.body)

    // Validate input
    if (!req.file && !req.body.fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'No file or file URL provided'
      })
    }

    let fileUrl, fileName, fileType

    // Handle file upload
    if (req.file) {
      try {
        console.log('Starting Cloudinary upload...')
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        )

        fileUrl = result.secure_url
        fileName = req.file.originalname
        fileType = req.file.mimetype

        console.log('Upload successful:', fileUrl)
      } catch (uploadError) {
        console.error('Upload failed:', uploadError)
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: uploadError.message
        })
      }
    } else {
      // Handle file URL case
      fileUrl = req.body.fileUrl
      fileName = req.body.fileName || 'Uploaded File'
      fileType = req.body.fileType || 'application/octet-stream'
    }

    // Validate required fields
    const requiredFields = [
      'title',
      'collegeName',
      'courseName',
      'batch',
      'subjectName',
      'semester'
    ]
    const missingFields = requiredFields.filter(field => !req.body[field])

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    // Create new note
    const newNote = await Note.create({
      title: req.body.title,
      description: req.body.description || '',
      collegeName: req.body.collegeName,
      courseName: req.body.courseName,
      batch: req.body.batch,
      subjectName: req.body.subjectName,
      semester: req.body.semester,
      uploader: req.body.uploader || req.user?.id,
      fileUrl,
      fileName,
      fileType
    })

    return res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      data: newNote
    })
  } catch (error) {
    console.error('Controller error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred'
    })
  }
}

// Export multer middleware
export const uploadMiddleware = upload.single('file')

export const deleteNotes = async (req, res, next) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    return next(errorHandler(404, 'Notes not found'))
  }

  if (req.user.id !== note.uploader.toString()) {
    return next(errorHandler(401, 'You can only delete your own uploads'))
  }

  try {
    // If the file is on Cloudinary, delete it
    if (note.fileUrl && note.fileUrl.includes('cloudinary.com')) {
      const publicId = note.fileUrl.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(publicId)
    }

    await Note.findByIdAndDelete(req.params.id)
    res.status(200).json('Notes has been deleted')
  } catch (error) {
    next(error)
  }
}

export const updateNotes = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return next(errorHandler(404, 'Notes not found'))
    }

    if (req.user.id !== note.uploader.toString()) {
      return next(errorHandler(401, 'You can only update your own uploads'))
    }

    // Update file if present
    if (req.file) {
      try {
        // Delete old file if it exists on Cloudinary
        if (note.fileUrl && note.fileUrl.includes('cloudinary.com')) {
          const publicId = note.fileUrl.split('/').pop().split('.')[0]
          await cloudinary.uploader.destroy(publicId)
        }

        // Upload new file to Cloudinary using the buffer
        const result = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname
        )

        note.fileUrl = result.secure_url
        note.fileName = req.file.originalname
        note.fileType = req.file.mimetype
      } catch (cloudinaryError) {
        console.error('Cloudinary update error:', cloudinaryError)
        return res.status(500).json({
          success: false,
          message: 'Error updating file in cloud storage'
        })
      }
    } else if (req.body.fileUrl) {
      note.fileUrl = req.body.fileUrl
      note.fileName = req.body.fileName || 'File from URL'
      note.fileType = req.body.fileType || 'application/octet-stream'
    }

    // Update other fields
    if (req.body.title) note.title = req.body.title
    if (req.body.description) note.description = req.body.description
    if (req.body.subjectName) note.subjectName = req.body.subjectName
    if (req.body.collegeName) note.collegeName = req.body.collegeName
    if (req.body.courseName) note.courseName = req.body.courseName
    if (req.body.batch) note.batch = req.body.batch
    if (req.body.semester) note.semester = req.body.semester

    await note.save()

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note
    })
  } catch (error) {
    console.error('Detailed error:', error)
    next(error)
  }
}
export const getNotes = async (req, res, next) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    return next(errorHandler(404, 'Notes not found'))
  }

  try {
    // Update was called but no update was needed,
    // we'll just use findById instead of findByIdAndUpdate
    res.status(200).json({
      success: true,
      note
    })
  } catch (error) {
    next(error)
  }
}

// Export multer middleware for use in routes

// New function to get all notes with filtering
export const getAllNotes = async (req, res, next) => {
  try {
    const { search, subject, course, semester, college } = req.query

    // Build filter object
    const filter = {}

    // Add search filter (searches title, description, and subject)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subjectName: { $regex: search, $options: 'i' } }
      ]
    }

    // Add other filters
    if (subject) filter.subjectName = { $regex: subject, $options: 'i' }
    if (course) filter.courseName = { $regex: course, $options: 'i' }
    if (semester) filter.semester = { $regex: semester, $options: 'i' }
    if (college) filter.collegeName = { $regex: college, $options: 'i' }

    // Get notes with populated user data
    const notes = await Note.find(filter)
      .populate('uploader', 'username')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    })
  } catch (error) {
    next(error)
  }
}

// Function to download a file
export const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return next(errorHandler(404, 'Note not found'))
    }

    if (!note.fileUrl) {
      return next(errorHandler(404, 'File not found for this note'))
    }

    // Set the appropriate headers for download
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${note.fileName}"`
    )

    // If you want to set the content type based on the file's type
    if (note.fileType) {
      res.setHeader('Content-Type', note.fileType)
    }

    // Proxy the request to Cloudinary instead of redirecting
    // You can use a library like 'axios' or Node's built-in http/https

    https
      .get(note.fileUrl, fileResponse => {
        // Pipe the file data directly to the response
        fileResponse.pipe(res)

        // Handle any errors in the file download stream
        fileResponse.on('error', err => {
          console.error('Error downloading file from Cloudinary:', err)
          next(errorHandler(500, 'Error downloading file'))
        })
      })
      .on('error', err => {
        console.error('Error connecting to Cloudinary:', err)
        next(errorHandler(500, 'Error connecting to file server'))
      })
  } catch (error) {
    console.error('Download error:', error)
    next(error)
  }
}
