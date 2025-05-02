import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import session from "express-session";
import SequelizeStoreInit from "connect-session-sequelize";
import sequelize from "./config/database.js";
import { specs } from "./config/swagger.js";
import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import social from "./routes/socialRoutes.js";
import profile from "./routes/profileRoutes.js";
import post from "./routes/postRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder (for uploads)
app.use("/uploads", express.static("upload"));

// Swagger docs

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Session setup
const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/post", post);
app.use("/profile", profile);
app.use("/social", social);

// Error handler
app.use(errorHandler);

// 404 handler (fixed parameter order)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Server start
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `📘 Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
