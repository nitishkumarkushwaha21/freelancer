import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not set.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}
