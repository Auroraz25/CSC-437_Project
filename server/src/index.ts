import express from "express";
import { connect } from "./services/mongo";
import cors from 'cors';

import authors from "./routes/authors";
import books from "./routes/books";
import categories from "./routes/categories";
import comments from "./routes/comments";
import statuses from "./routes/statuses";
import users from "./routes/users";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("book_collection");

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(express.static(staticDir));

app.use("/auth", auth);

// Protected API routes (authentication required)
app.use("/api/authors", authenticateUser, authors);
app.use("/api/books", authenticateUser, books);
app.use("/api/categories", authenticateUser, categories);
app.use("/api/comments", authenticateUser, comments);
app.use("/api/statuses", authenticateUser, statuses);
app.use("/api/users", authenticateUser, users);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});