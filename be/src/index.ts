import express from 'express';
import DBConnect from './config/db';
import dotenv from 'dotenv';
const app = express();


dotenv.config();
DBConnect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

