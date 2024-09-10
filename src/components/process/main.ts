import { Process, Service, Services } from "../../interfaces";
import Api from "../service/api";
import Database from "../service/database";



export default class Main implements Process {
  name: string;
  services: { [key: string]: Service };
  constructor() {
    this.name = "Main";
    this.services = <Services>{};
  }
  static getInstance() {
    return this;
  }
  init(): void {
    console.log("Initializing Main Process");
    this.loadServices();
    Object.keys(this.services).forEach((key) => {
      const service = this.services[key];
      service.init();
    });
  }

  start(): void {
    Object.keys(this.services).forEach((key) => {
      const service = this.services[key];
      service.start();
    });
  }

  stop(): void {
    Object.keys(this.services).forEach((key) => {
      const service = this.services[key];
      service.start();
    });
  }

  loadServices(): void {
    this.services["database"] = new Database(this);
    this.services["api"] = new Api(this);
  }
}