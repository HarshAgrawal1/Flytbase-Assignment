# **FlytBase Chat Application**  

# Supports all file formats included in the assignment; forgot to highlight this in the demo video - FOR EVALUATION.
A **real-time chat application** with **secure messaging, file sharing, and offline support**, built using **Node.js, Express, MongoDB, and Socket.io**.

---
https://www.youtube.com/watch?v=V_84KxaF1UA

## **📌 Features**
✅ **Real-time Messaging** using **Socket.IO**  
✅ **File Sharing** (Images, Documents, Videos)  
✅ **Offline Message Queue** (Ensures delivery after reconnect)  
✅ **Secure Authentication** using **JWT**  
✅ **Database Optimization** for **fast retrieval**  
✅ **Scalable Architecture** for handling multiple rooms  

---

## **📌 Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/flytbase-chat.git
cd flytbase-chat
```
## **2️⃣ Install Dependencies**
```sh
npm install
```
## **3️⃣ Setup Environment Variables**
Create a .env file and configure:
```sh
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatApp
JWT_SECRET=your_secret_key
```
## **4️⃣ Start the Server**
```sh
node index.js
```
or use nodemon for live updates:

```sh
npm run dev
```
## **Architecture**
![image](https://github.com/user-attachments/assets/41de2645-fcb0-4c0e-86f3-f86d57e9af01)


## **📌 Technology Stack**
**Backend**: Node.js, Express.js, MongoDB, WebSockets

**Frontend**: EJS, JavaScript, CSS

**Authentication**: JWT (JSON Web Tokens)

**File Uploads**: Multer


## **📌 System Testing & Validation** 

✅ **Message Order Correction**

**Test**: Simulated network delay to check if messages arrive in the correct order

**Result**: Messages are sorted based on timestamps to maintain conversation flow


✅ **Authentication & Security**

**Test**: Attempted unauthorized access using expired JWT

**Result**: System rejects unauthorized requests with a 401 error



## **📌 Security Measures**

🔒 **JWT Authentication**: Secure user login & session management

🔒 **Password Hashing**: Bcrypt used for storing hashed passwords


## **📌 Scalability & Future Enhancements**

🚀 **Horizontal Scaling**: Add more WebSocket servers for large-scale messaging

☁️ **Cloud Storage**: Upgrade file storage to AWS S3 or Firebase

🤖 **AI-Powered Moderation**: Future implementation for content filtering


## **📌 Contributors**

👤 **Harsh Agrawal**

📧 agrawalharsh0522@gmail.com
