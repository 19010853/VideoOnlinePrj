import express from 'express';
import DBConnect from './config/db';
import dotenv from 'dotenv';
import routes from './route/index';
const app = express();


dotenv.config();
DBConnect();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

