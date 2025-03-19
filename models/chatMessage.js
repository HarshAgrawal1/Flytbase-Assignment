const mongoose=require('mongoose');
const dotenv = require("dotenv");
require("dotenv").config();

const mongo=process.env.MONGO;
mongoose.connect(mongo);

const chatMessageSchema = new mongoose.Schema({
    // roomId: { type: String, required: true }, // Room ID for the chat
    // senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Who sent the message
    // message: { type: String, required: true },
    // timestamp: { type: Date, default: Date.now }

    roomId: { type: String, required: true }, // Room ID for the chat
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Who sent the message
    message: { type: String }, // Text message (optional if it's a file)
    status: { type: String, enum: ["sent", "delivered"], default: "sent" },
    fileUrl: { type: String }, // File URL (optional if it's text)
    fileType: { type: String }, // Type of file (image, pdf, etc.)
    type: { type: String, default: "text" }, // "text" or "file"
    timestamp: { type: Date, default: Date.now }
});

module.exports=mongoose.model('chatMessage',chatMessageSchema);