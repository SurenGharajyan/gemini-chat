import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';
import chatRoutes from './src/routes/chatRoutes';


dotenv.config({ path: path.resolve(__dirname, './env') });

const app = express();
const mongoUri = process.env.DB;

app.use(express.json());
app.use(cors());

if (!mongoUri) {
    console.error('DB environment variable is not set');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/', chatRoutes);

export default app;
