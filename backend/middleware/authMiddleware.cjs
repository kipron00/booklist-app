// middleware/authMiddleware.js
const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  console.log('🔐 Authorization header:', authHeader)

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('❌ Invalid Authorization format')
    return res.status(401).json({ message: 'Format must be Bearer [token]' })
  }

  const token = parts[1]
  console.log('🔑 Received token:', token.substring(0, 50) + '...')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('✅ Token verified:', decoded)
    req.user = decoded
    next()
  } catch (err) {
    console.error('🚫 Token verification failed:', err.message)
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware