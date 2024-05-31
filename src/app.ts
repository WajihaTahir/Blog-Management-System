import express, { Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/UserRoutes";
import "dotenv/config";
import { appErrors } from "./utils/appStrings";

export const app = express();

const addMiddlewares = () => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
};

const addRoutes = () => {
  app.use("/api/user", userRouter);
  app.use("*", (req, res) =>
    res.status(404).json({ error: appErrors.notFoundError })
  );
};

const DBConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MongoDB URI is not defined in the environment variables."
      );
    }
    await mongoose.connect(mongoUri);
    console.log("connection to the MongoDB established");
  } catch (error) {
    console.log("error connecting to the MongoDB");
  }
};

export const startServer = () => {
  return new Promise<void>((resolve, reject) => {
    const port = process.env.PORT || 5001;

    const server = app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
      resolve();
    });

    server.on("error", (error: any) => {
      reject(error);
    });
  });
};

addMiddlewares();
addRoutes();

if (process.env.NODE_ENV !== "test") {
  (async function controller() {
    await DBConnection();
    await startServer();
  })();
}
