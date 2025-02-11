import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes';

const app = express();
const mongoUri = process.env.DB;

app.use(express.json());
const allowedOrigins = [
    "http://localhost:3000",
    "https://gemini-chat.surengharajyan.com"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

if (!mongoUri) {
    console.error('DB environment variable is not set');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use('/', chatRoutes);



export default app;
