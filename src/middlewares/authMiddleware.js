import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    try {
      // Giải mã token và gán thông tin người dùng vào request
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

export const verifyToken = authMiddleware


