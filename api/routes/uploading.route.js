import express from 'express'
import {
  notesUploading,
  deleteNotes,
  updateNotes,
  getNotes,
  uploadMiddleware
} from '../controllers/uploading.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
import cors from 'cors'

const router = express.Router()

// CORS Configuration
const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'credentials']
}

// Apply CORS globally  
router.use(cors(corsConfig))    


// Middleware to validate file content
const ensureFileContent = (req, res, next) => {
  if (
    !req.file &&
    !req.body.fileUrl &&
    !req.path.startsWith('/update/') // Check URL path
  ) {
    return res.status(400).json({
      success: false,
      message: 'No file content provided. Upload a file or provide a URL.'
    })
  }
  next()
}

// Routes
router.post(
  '/create',
  verifyToken,
  uploadMiddleware, // Handle file upload first
  ensureFileContent,
  notesUploading
)

router.delete('/delete/:id', verifyToken, deleteNotes)
router.post('/update/:id', verifyToken, uploadMiddleware, updateNotes)
router.get('/get/:id', getNotes)

export default router
