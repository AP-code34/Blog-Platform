# Blog Platform

A full-stack MERN blogging platform where users can create and share blog posts, review other blogs, and communicate with strangers in a vibrant community.

## 🌟 Features

### Core Functionality

- **Blog Management**
  - Create, edit, and delete blog posts
  - Rich text editor (React Quill) for enhanced content creation
  - Post categorization system for better organization
- **Community Engagement**
  - Comment system for discussions
  - Review and interact with other users' blogs
  - Connect and communicate with strangers

- **User Authentication**
  - Secure JWT-based authentication
  - Password encryption with bcrypt
  - Cookie-based session management

## 🚀 Tech Stack

### Frontend

- **React 18.3.1** - UI library for building interactive interfaces
- **Vite 7.0.4** - Next-generation frontend tooling with HMR
- **React Router DOM 6.25.1** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Quill 2.0.0** - Rich text editor component
- **Axios 1.13.2** - HTTP client for API requests
- **Lucide React & React Icons** - Icon libraries
- **React Loading Skeleton** - Loading state components
- **HTML React Parser** - Parse HTML strings to React components

### Backend

- **Node.js** - JavaScript runtime for server-side logic
- **Express 5.1.0** - Web application framework
- **Mongoose 8.20.0** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing
- **Cookie Parser 1.4.7** - Parse cookies
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 17.2.3** - Environment variable management

### Database

- **MongoDB** - NoSQL database for flexible data storage

### Development Tools

- **Nodemon** - Auto-restart server on changes
- **ESLint** - Code linting and quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## ⚙️ Installation

1. **Clone the repository**

```bash
   git clone https://github.com/AP-code34/Blog-Platform.git
   cd Blog-Platform
```

2. **Install backend dependencies**

```bash
   cd Backend
   npm install
```

3. **Install frontend dependencies**

```bash
   cd ../WatchCraft
   npm install
```

4. **Set up environment variables**

   Create a `.env` file in the `Backend` directory:

```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start MongoDB**
   Make sure MongoDB is running on your system or you have a cloud MongoDB connection

2. **Start the backend server**

```bash
   cd Backend
   npm run dev
   # Server runs on http://localhost:5000
```

3. **Start the frontend development server** (in a new terminal)

```bash
   cd WatchCraft
   npm run dev
   # Frontend runs on http://localhost:5173
```

4. Open your browser and navigate to `http://localhost:5173`

### Production Build

**Frontend:**

```bash
cd WatchCraft
npm run build
npm run preview
```

**Backend:**

```bash
cd Backend
npm start
```

## 📁 Project Structure

```
Blog-Platform/
├── WatchCraft/              # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── Pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── Backend/                # Node.js + Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware (auth, etc.)
│   ├── config/             # Configuration files
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
│
└── README.md              # Project documentation
```

## 🛠️ Available Scripts

### Frontend (WatchCraft)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (Backend)

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Blog Posts

- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get single blog post
- `POST /api/posts` - Create new blog post (authenticated)
- `PUT /api/posts/:id` - Update blog post (authenticated)
- `DELETE /api/posts/:id` - Delete blog post (authenticated)

### Comments

- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add comment to a post (authenticated)
- `DELETE /api/comments/:id` - Delete a comment (authenticated)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (authenticated)

## 🔐 Authentication

This application uses **JWT (JSON Web Tokens)** for authentication:

- Tokens are stored in HTTP-only cookies for security
- Passwords are hashed using bcrypt before storage
- Protected routes require valid JWT tokens
- CORS is configured for cross-origin requests

## 🎨 UI Components & Libraries

- **Tailwind CSS** - Responsive, utility-first styling
- **React Quill** - WYSIWYG rich text editor for blog posts
- **Lucide React & React Icons** - Modern icon sets
- **React Loading Skeleton** - Elegant loading states
- **HTML React Parser** - Safely render HTML content from blog posts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Ashim** - [GitHub](https://github.com/AP-code34)

## 🙏 Acknowledgments

- React team for the amazing library
- Vite for blazing fast build tooling
- MongoDB for flexible data storage
- The open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🔧 Development Notes

**Vite Configuration:**

- This project uses **@vitejs/plugin-react 4.6.0** with Babel for Fast Refresh
- HMR (Hot Module Replacement) enabled for instant updates during development
- ESLint configured with React hooks and React refresh plugins

**ES Modules:**

- Both frontend and backend use ES6 module syntax (`"type": "module"`)
- Use `import/export` instead of `require/module.exports`

**Styling:**

- Tailwind CSS v4 with Vite plugin for optimal performance
- Utility-first approach for rapid UI development

---

Made with ❤️ using the MERN stack
