import express from 'express'
import {
  getAllNotes,
  likeNote,
  commentOnNote,
  incrementDownload,
  archiveNote,
  getArchives,
  removeArchiveNote,
  updateComment,
  deleteComment
} from '../controllers/notes.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/archive/:id', verifyToken, archiveNote)
router.get('/archived/:id', verifyToken, getArchives)
router.post('/remove-archive/:id', verifyToken, removeArchiveNote) //

router.get('/', getAllNotes) // Get all notes
router.put('/:id/like', verifyToken, likeNote) // Like/unlike
router.put('/comments/:noteId/:commentId', verifyToken, updateComment) // Edit comment
router.delete('/comments/:noteId/:commentId', verifyToken, deleteComment) // Edit comment
router.post('/:id/comment', verifyToken, commentOnNote) // Comment
router.put('/:id/download', incrementDownload) // Increment download count

export default router
