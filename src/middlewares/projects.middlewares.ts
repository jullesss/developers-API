import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TProjects, TTechs } from "../interfaces/projects.interfaces";

const ensureProjectIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT * FROM projects
    WHERE id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  return next();
};

const ensureTechExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let name: string = req.body.name;

  if (
    req.route.path === "/projects/:id/technologies/:name" &&
    req.method === "DELETE"
  ) {
    name = req.params.name;
  }

  const queryString = `
  SELECT id FROM technologies WHERE name = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<TTechs> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.tech = queryResult.rows[0].id;

  return next();
};

const noRepeatedTechName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  const techId = res.locals.tech;

  const queryString = `
  SELECT 
  * 
  FROM projects_technologies pt
  WHERE pt."projectId" = $1 AND pt."technologyId" = $2;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, techId],
  };

  const queryResult: QueryResult<TTechs> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};
export { ensureProjectIdExists, ensureTechExists, noRepeatedTechName };
