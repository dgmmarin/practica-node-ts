/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import cors from "cors";
import { Process, Service } from "../../interfaces";
import authenticateJWT from "../../middlewares/Auth";
import getRequestedUser from "../../middlewares/UserOnRequest";
import auth from "../../routes/auth";
import users from "../../routes/users";
import roles from "../../routes/roles";
import root from "../../routes/root";
import expressListRoutes from "express-list-routes";


export default class Api implements Service {
  name: string;
  app: ReturnType<typeof express>;
  port: number;
  parent: Process;
  constructor(parent: Process) {
    this.name = "Api";
    this.parent = parent;
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.registerRoutes = this.registerRoutes.bind(this);
  }

  init(): void {
    this.port = process.env.NODE_PORT ? Number(process.env.NODE_PORT) : 3001;
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
      }));
    this.registerRoutes();
    console.log(`Initializing ${this.name} service`);
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Service ${this.name} at http://localhost:${this.port}`);
      expressListRoutes(this.app, {
        prefix: '', // A prefix for router Path
        spacer: 7,   // Spacer between router Method and Path
        logger: console.info, // A custom logger function
        color: true // If the console log should color the method name
      });
    });
  }

  stop(): void {
    throw new Error("Method not implemented.");
  }

  registerRoutes(): void {
    this.app.use("/test",root);
    this.app.use("/auth", auth);
    this.app.use("/users", users);
    // this.app.use("/users", authenticateJWT, getRequestedUser, users);
    // this.app.use("/roles", authenticateJWT, getRequestedUser, roles);
    // this.app.use(
    //   "/permissions",
    //   authenticateJWT,
    //   getRequestedUser,
    //   permissions,
    // );
    // this.app.use("/categories", authenticateJWT, getRequestedUser, categories);
    // this.app.use("/products", authenticateJWT, getRequestedUser, products);
    // this.app.use("/orders", authenticateJWT, getRequestedUser, orders);
  }
}