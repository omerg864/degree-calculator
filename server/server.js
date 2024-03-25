import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const config = dotenv.config();
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import { fileURLToPath } from 'url';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import sanitizeMiddleware from './middleware/sanitizeMiddleware.js';
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mongoSanitize());


app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    credentials: true,
  }
));
app.use(sanitizeMiddleware);
app.use(rateLimiterMiddleware);

app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use('/api/name', name); use the route
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  })
}

app.use(errorHandler);