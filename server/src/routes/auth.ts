import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  Response
} from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string =
  process.env.TOKEN_SECRET || "NOT_A_SECRET";

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .create(username, password)
      .then((creds) => generateAccessToken(creds.username))
      .then((token) => {
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        res.status(409).send({ error: err.message });
      });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
});

function generateAccessToken(
  username: string
): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Access token required",
      message: "Please provide a valid authentication token"
    });
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ 
        error: "Invalid token",
        message: "The provided token is invalid or expired"
      });
    }
    
    if (decoded && typeof decoded === 'object') {
      // Add user info to request object
      (req as any).user = decoded;
      next();
    } else {
      return res.status(403).json({ 
        error: "Invalid token format",
        message: "Token payload is malformed"
      });
    }
  });
}

export default router;