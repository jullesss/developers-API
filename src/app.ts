import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getDeveloper,
  updateDeveloper,
} from "./logics/developers.logics";
import {
  checkEmail,
  ensureIdExists,
} from "./middlewares/developers.middlewares";
import { createProject, getProject } from "./logics/projects.logics";
import { ensureProjectIdExists } from "./middlewares/projects.middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmail, createDeveloper);
app.get("/developers/:id", ensureIdExists, getDeveloper);
app.post("/developers/:id/infos", ensureIdExists, createDeveloperInfo);
app.patch("/developers/:id", ensureIdExists, checkEmail, updateDeveloper);
app.delete("/developers/:id", ensureIdExists, deleteDeveloper);

app.post("/projects", ensureIdExists, createProject);
app.get("/projects/:id", ensureProjectIdExists, getProject);
app.patch("/projects/:id");
app.delete("/projects/:id");
app.post("/projects/:id/technologies");
app.delete("/projects/:id/technologies/name");

export default app;
