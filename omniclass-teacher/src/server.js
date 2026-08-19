import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import { notFound, errorHandler } from "./middleware/errors.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "2mb" }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // Development only: use migrations in production
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`OmniClass Teacher API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

start();
