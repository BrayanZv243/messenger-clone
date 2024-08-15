# 💬 Messenger

Welcome to **Messenger** – Send a Message! Or maybe a video, or image, or whatever. <br>
Messenger is an instant messaging app that lets users send text messages and share multimedia content like photos and videos.<br>
Seamlessly integrates with Google and GitHub for connecting with friends and signing up.

## 🚀 Features

- **Instant Messaging**: Send and receive text messages in real time.<br>
- **Multimedia Sharing**: Share photos, videos, and more directly in your chats.<br>
- **User Authentication**: Secure and seamless sign-in/sign-up using Google and GitHub.<br>
- **Real-time Notifications**: Get notified instantly when you receive new messages.<br>
- **Sign in and Sign Up Google and GitHub**: Use any of these services to connect to Messenger.<br>
- **Chat Groups**: Create a lot of groups with your family or friends.<br>
- **Responsive Design**: Tailwind CSS ensures a great user experience on any device.<br>

## 🛠️ Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.<br>
- **Vercel**: Hosting and deployment.<br>
- **React**: JavaScript library for building user interfaces.<br>
- **TypeScript**: Superset of JavaScript for static type checking.<br>
- **Google and GitHub**: Integrated for authentication and account management.<br>
- **Tailwind CSS**: Utility-first CSS framework for styling.<br>
- **MongoDB**: NoSQL database for storing messages and user data.<br>
- **Pusher**: Real-time communication service for instant message delivery.<br>
- **Cloudinary**: Cloud service for storing and serving images and videos.<br>
- **Prisma**: ORM for database management with TypeScript.<br>

## 📦 Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) and npm installed<br>
- [MongoDB](https://www.mongodb.com/) database setup<br>
- [Pusher](https://pusher.com/) account for real-time messaging<br>
- [Cloudinary](https://cloudinary.com/) account for multimedia content management<br>

### Installation

1. **Clone the repository**:<br>
   ```sh
   git clone https://github.com/BrayanZv243/messenger-clone
   cd messenger
2. **Install dependencies**:<br>
   ```sh
   npm install
3. **Configure environment variables**:<br>
Create a .env file in the root directory and add your Pusher, MongoDB Atlas, Cloudinary, Google and GitHub configuration:
   ```sh
   # Mongo DB
   DATABASE_URL=<your-mongodb-url>

   # Next Auth
   NEXTAUTH_SECRET=<your-next-auth-secret>
   
   # Github keys
   GITHUB_ID=<your-github-id>
   GITHUB_SECRET=<your-github-secret>
    
   # Google keys
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    
   # Next Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-next-public-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
    
   # Pusher API
   NEXT_PUBLIC_PUSHER_APP_KEY=<your-next-public-pusher-app-key>
   PUSHER_APP_ID=<your-pusher-app-id>
   PUSHER_SECRET=<your-pusher-secret>

### Running the Application

1. **Start the development server**:<br>
   ```sh
   npm run dev
2. **Open your browser and navigate to**:<br>
   ```sh
   http://localhost:3000

## 🌐 Deployment
- **Connect your GitHub repository** to Vercel. <br>
- **Set up your environment variables** on Vercel.<br>
- **Deploy** your application.<br>
