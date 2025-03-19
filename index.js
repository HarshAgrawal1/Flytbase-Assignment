const express=require('express');
const app=express();

const dotenv = require("dotenv");
const mongoose =require('mongoose');
const multer=require('multer');
const upload = require("./upload");

// initializing jswt and cookie parser for session management

const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');

const path=require("path");
app.set("view engine", "ejs");  // ejs for frontend
app.use(express.static(path.join(__dirname, "public")));  // for public files like css folder , javascript folder as well as for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//  json response and urlencoded will help in session management 
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
require("dotenv").config();
const secret = process.env.SECRET_JWT;



const http=require('http');
const server = http.createServer(app);
const socketIo=require('socket.io');
const io = socketIo(server);
const { v4: uuidv4 } = require('uuid'); 



const userModel=require('./models/user');
const chatMessage=require('./models/chatMessage')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.redirect("/login");
      req.user = user;
      next();
    });
  };

app.get("/",verifyToken,async function(req,res){
    const user=await userModel.findOne({email:req.user.email}).populate("connections", "name");
    return res.render("index",{user:user,friends: user ? user.connections : []});
});

app.get("/signup",function(req,res){
    res.clearCookie("token");
    return res.render("signup");
});


app.get("/login",function(req,res){
    res.clearCookie("token");
    return res.render("login")
});

app.get("/logout", (req, res) => {
    res.clearCookie("token"); 
    res.redirect("/");
});

app.post("/signup/create",function(req,res){
    let{name,phone,email,password}=req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let createdUser=await userModel.create({
                name:name,
                phone:phone,
                email:email,
                password:hash
            });
            var token = jwt.sign({email : email },secret,{ expiresIn: "1h" });
            res.cookie("token",token, { httpOnly: true, secure: false });
            return res.redirect("/");
        });
    });
});

app.post("/login/read",async function(req,res){
    let{email,password}=req.body;

    let user= await userModel.findOne({email:email});
    if(!user) return res.redirect("/signup");

    console.log("hello");
    await bcrypt.compare(password,user.password,function(err,result){
        
        if (result){
            res.clearCookie("token");
            var token = jwt.sign({email : email },secret,{ expiresIn: "1h" });
            res.cookie("token",token, { httpOnly: true, secure: false });
            return res.redirect("/");
        
        } 
            

        else return res.send("Incorrect password!!")
    });

    // return res.send("something went wrong!!");
    

});

app.get("/invite",verifyToken,function(req,res){
    return res.render("invite",{message:""});
})

app.post("/invite-process",verifyToken,async function(req,res){
    const {phone} = req.body;

    try {
      
        const user1=await userModel.findOne({email:req.user.email});
        const user2 = await userModel.findOne({ phone: phone });

        if (!user1 || !user2) {
            return res.render("invite", { message: "This number is not registered!" });
        }
        if (user1.connections.includes(user2._id) || user2.connections.includes(user1._id)) {
            return res.render("invite", { message: "Already invited!" });
        }

        user1.connections.push(user2._id);
        user2.connections.push(user1._id);

        await user1.save();
        await user2.save();

        
        

        res.send("Made connection!!")
    } catch (error) {
        console.error(error);
        res.render("invite", { message: "Something went wrong!" });
    }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.post("/send-message", async (req, res) => {
    try {
        const { roomId, senderId, message } = req.body;

        const newMessage = new chatMessage({ roomId, senderId, message, type: "text" });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/send-file", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { roomId, senderId } = req.body;
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith("image") ? "image" : "file";

        const newMessage = new chatMessage({ roomId, senderId, fileUrl, fileType, type: "file" });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/messages/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await chatMessage.find({ roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/chat/:id",verifyToken,async function(req,res){
    const user=await userModel.findOne({email:req.user.email});
    const old_messages = await chatMessage.find({ roomId:req.params.id }).sort({ timestamp:1 });
    
    if (!Array.isArray(old_messages)) {
        old_messages = [];
    }
    console.log(typeof(old_messages));
    
    return res.render("chat", { userId: user._id, roomId: req.params.id ,old_messages});
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

   
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    
    socket.on("chatMessage", async (data, callback) => {
        try {
            const { roomId, userId, message } = data;

            const newMessage = new chatMessage({ roomId, senderId: userId, message, status: "sent" });
            await newMessage.save();

            io.to(roomId).emit("message", newMessage); // Send to all users in the room
            newMessage.status="delivered";
            newMessage.save();
            callback({ success: true }); // Acknowledge message delivery
        } catch (error) {
            callback({ success: false, error: "Message delivery failed" });
        }
    });


    socket.on("fileMessage", async (data,callback) => {
        try {
            const { roomId, senderId, fileUrl, fileType }=data;
            const newFileMessage = new chatMessage({ roomId, senderId, message: fileUrl, type: "file" });
            await newFileMessage.save();


            // Broadcast the file message
            io.to(roomId).emit("fileMessage", { senderId, fileUrl, fileType, type: "file" });
            callback({ success: true }); // Acknowledge message delivery
        } catch (error) {
            callback({ success: false, error: "Message delivery failed" });
        }
    });
    socket.on("reconnect", async () => {
        const user = users[socket.id];
        if (user) {
            const missedMessages = await chatMessage.find({ roomId: user.roomId, status: "sent" });
            missedMessages.forEach(msg => {
                socket.emit("message", msg);
                msg.status="delivered";
                msg.save();
            });
        }
    });

    socket.on("disconnect", () => {
        // delete users[socket.id];
        console.log("User disconnected:", socket.id);
    });

    
});




server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
  