const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");


dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

const events = require("./routes/eventsRoutes.js");
app.use("/api/v3/app", events);


const server = app.listen(PORT, () => {
    console.log(`server is working on http://localhost:${PORT}`);
});

