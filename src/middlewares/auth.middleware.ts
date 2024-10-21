import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

 const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Session Expired',
        });
      }

      next();
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: 'Session Expired',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token signature',
        });
      } else if (error instanceof Error) {
        console.error('Authentication Error: ', error.message);
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      console.error('Unknown error during authentication: ', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login required',
    });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }


    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export { authenticate as protect, isAdmin };
