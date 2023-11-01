import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const config = dotenv.config();
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';


connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use('/api/name', name); use the route
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'));
  })
}

app.use(errorHandler);