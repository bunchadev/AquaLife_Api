import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY)
      req.user = decoded
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  } catch (err) {
    next(err)
  }
}

// alias to match existing imports
export const verifyToken = authMiddleware


