// middleware/avatarUpload.middleware.js
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

cloudinary.api.ping((err, res) => {
  //console.log("Cloudinary Ping:", err || res);
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
    public_id: (req, file) => `avatar-${Date.now()}-${file.originalname}`
  }
})

export const avatarUpload = multer({ storage })
