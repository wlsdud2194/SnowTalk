import { Response, NextFunction } from "express";
import * as tokenLib from '../lib/token.lib';
import { AuthRequest } from "../typings";

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers['token'];
  console.log("토큰: ", token);
  if (!token || Array.isArray(token)) {
    res.status(400).json({
      status: 400,
      message: '접근할 수 없습니다. 다시 로그인 해주세요',
    });

    return;
  }

  try {
    const decoded = tokenLib.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        status: 401,
        message: '잘못된 권한입니다',
      });

      return;
    }

    req.decoded = decoded;
  } catch (error) {
    const [status, message] = tokenLib.searchTokenError(error);

    res.status(status).json({
      status, message,
    });

    return;
  }

  next();
}

export default authMiddleware;
