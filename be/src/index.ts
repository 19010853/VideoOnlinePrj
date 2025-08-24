import express from 'express';
import DBConnect from './config/db';
import dotenv from 'dotenv';
import routes from './route/index';
import passportJWT from "./config/passportJWT";
import cors from 'cors';
const app = express();

dotenv.config();
DBConnect();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(passportJWT.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

