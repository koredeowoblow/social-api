# Social API 🚀

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A backend REST API for a social media application built using **Node.js**, **Express**, **Sequelize**, and **MySQL**.

This API handles user authentication, posts, likes, comments, notifications, and other core social features.

---

## 🌟 Features

✅ User registration and login (with JWT)  
✅ Create, read, update, delete (CRUD) posts  
✅ Like and comment on posts  
✅ Follow and unfollow users  
✅ Notification system for likes, comments, follows  
✅ Sequelize ORM with MySQL database  
✅ Clean modular structure with separate models, controllers, routes

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)

---

## 📂 Project Structure

```

/src
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Auth, validation middleware
├── models/         # Sequelize models
├── routes/         # API route definitions
└── app.js          # Main app entry point

````

---

## ⚙️ Setup Instructions

1️⃣ **Clone the repository**
```
git clone https://github.com/koredeowoblow/social-api.git
cd social-api
````

2️⃣ **Install dependencies**

```bash
npm install
````
3️⃣ **Set up your `.env` file**
Create a `.env` file in the root:

```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=social_media
JWT_SECRET=your_jwt_secret
```

4️⃣ **Set up the database**

* Ensure your MySQL server is running.
* Run Sequelize sync or migrations:



5️⃣ **Start the server**

```bash
npm run dev
```

Visit: `http://localhost:5000`

---
```

## 📚 API Endpoints (Core)

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| POST   | /api/auth/register       | Register new user      |
| POST   | /api/auth/login          | Login user             |
| GET    | /api/posts               | Get all posts          |
| POST   | /api/posts               | Create a new post      |
| POST   | /api/posts/\:id/like     | Like a post            |
| POST   | /api/posts/\:id/comment  | Comment on a post      |
| GET    | /api/users/\:id/follow   | Follow a user          |
| GET    | /api/users/\:id/unfollow | Unfollow a user        |
| GET    | /api/notifications       | Get user notifications |
````
## 📖 API Documentation

Detailed API docs (with request/response samples) coming soon!


---

## 💡 Contributing

Want to improve this project?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

We welcome all contributions!

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Author

Made with ❤️ by **[Shinaayomi Owolabi (koredeowoblow)](https://github.com/koredeowoblow)**
[LinkedIn](https://ng.linkedin.com/in/shinaayomi-owolabi-192210329) | [GitHub](https://github.com/koredeowoblow)
