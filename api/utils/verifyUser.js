import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

// Middleware to verify the token
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized user' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //console.log(decoded)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: 'Invalid or expired token' })
  }
}

// Middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      })
    }
    next()
  })
}

// Middleware to verify specific roles
export const verifyRole = roles => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Access denied' })
      }
      next()
    })
  }
}
