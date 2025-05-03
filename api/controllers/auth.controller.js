import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

import dotenv from 'dotenv'
dotenv.config()

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Fill the required fields'
    })
  }
  const existingUser = await User.findOne({ email })
  if (existingUser)
    return res.status(400).json({
      success: false,
      msg: 'User already exists'
    })
  const hashsedPassword = bcryptjs.hashSync(password, 10)

  // Generate avatar based on first character of username
  const avatarUrl = generateAvatarUrl(username.charAt(0).toUpperCase())

  const newUser = new User({
    username,
    email,
    password: hashsedPassword,
    avatar: avatarUrl,
    role: 'user',
    admin: email === process.env.ADMIN_EMAIL
  })

  // console.log(newUser);

  try {
    await newUser.save()
    res.status(201).json('User created succesfully')
  } catch (error) {
    next(error)
  }
}

// Helper function to generate avatar URL (same as in schema for consistency)
function generateAvatarUrl (firstChar) {
  // Using DiceBear's initials avatar API
  return `https://api.dicebear.com/7.x/initials/svg?seed=${firstChar}`
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Fill the required fields'
    })
  }

  try {
    // Admin login

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const admin = await User.findOne({ email: process.env.ADMIN_EMAIL })
      //console.log(admin)

      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '5d' }
      )

      return res
        .cookie('token', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 3600000,
          path: '/'
        })
        .status(200)
        .json({
          success: true,
          message: 'Successfully signed in as admin',
          user: {
            _id: admin._id,
            username: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            createdAt: admin.createdAt,
            avatar: admin.avatar
          },
          tokenExpiration: '5d'
        })
    }

    // User login
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User doesn't exist` })
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    )

    res.cookie('token', token, { httpOnly: true, secure: false }).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        email,
        role: user.role,
        id: user._id,
        createdAt: user.createdAt,
        username: user.username,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = user._doc

      res
        .cookie('token', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 3600000, // 1 hour
          path: '/'
        })
        .status(200)
        .json({ ...rest, _id: user._id }) // ✅ Return _id explicitly
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

      const result = await cloudinary.uploader.upload(req.body.photo, {
        folder: 'avatars',
        public_id: `google-${Date.now()}`
      })

      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: result.secure_url
      })

      await newUser.save()

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = newUser._doc

      res
        .cookie('token', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'None',
          maxAge: 3600000, // 1 hour
          path: '/'
        })
        .status(200)
        .json({ ...rest, _id: newUser._id }) // ✅ Also here
    }
  } catch (error) {
    next(error)
  }
}

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('token')
    res.status(200).json('User has been logged out')
  } catch (error) {
    next(error)
  }
}
