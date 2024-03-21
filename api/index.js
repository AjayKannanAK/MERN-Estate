import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB!");
}).catch((error) => {
    console.log(err);
})

const app = express();

app.listen(8080, ()=> {
    console.log("Server is running on port 8080")
})