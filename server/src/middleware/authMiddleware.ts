// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config'; // Using the hardcoded secret

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('--- PROTECT MIDDLEWARE RUNNING ---');

  // Log all headers to see exactly what's coming from Postman
  console.log('Request Headers:', req.headers);

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      console.log('Authorization Header Found:', authHeader);

      token = authHeader.split(' ')[1];
      console.log('Extracted Token:', token);
      console.log('Secret Key Being Used:', JWT_SECRET);

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('SUCCESS: Token successfully decoded:', decoded);

      req.user = decoded;
      next();
    } catch (error) {
      console.error('!!! TOKEN VERIFICATION FAILED !!!');
      console.error(error); // This will log the actual error from the jwt library
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    console.error('!!! No token found or header format is incorrect !!!');
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};