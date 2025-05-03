import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  text: {
    type: String,
    required: true
  },
  commentedAt: {
    type: Date,
    default: Date.now
  }
})

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Example: "Data Structures Notes"
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String
    // required: true, // PDF/file upload URL
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeName: {
    type: String,
    required: true // Example: "ABC Institute of Technology"
  },
  courseName: {
    type: String,
    required: true // Example: "BCA", "MCA", etc.
  },
  batch: {
    type: String,
    required: true // Example: "2021-2025"
  },
  semester: {
    type: String,
    required: true // Example: "5"
  },
  subjectName: {
    type: String,
    required: true // Example: "DBMS"
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: false // Admin approval
  },
  comments: {
    type: [commentSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Note = mongoose.model('Note', noteSchema)
export default Note
