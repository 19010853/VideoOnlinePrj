import express from 'express';
import DBConnect from './config/db';
const app = express();

DBConnect();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

