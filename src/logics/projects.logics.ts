import { Request, Response } from "express";
import {
  TProjects,
  TProjectsRequest,
  TProjectsTechs,
  TTechs,
  TTechsRequest,
} from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TProjectsRequest = req.body;

  const queryString: string = format(
    `
      INSERT INTO projects(%I) VALUES (%L)
      RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );
  const queryResult: QueryResult<TProjectsRequest> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

const getProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT 
      p.id AS "projectId",
      p.name AS "projectName",
      p.description AS "projectDescription",
      p."estimatedTime" AS "projectEstimatedTime",
      p.repository AS "projectRepository",
      p."startDate" AS "projectStartDate",
      p."endDate" AS "projectEndDate",
      p."developerId" AS "projectDeveloperId",
      pt."technologyId",
      t.name AS "technologyName"
      FROM projects p
      LEFT JOIN projects_technologies pt ON p.id = pt."projectId"
      LEFT JOIN technologies t ON t.id = pt."technologyId"
      WHERE p.id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<Array<TProjectsTechs>> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows);
};

const editProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const data: Partial<TProjectsRequest> = req.body;

  const queryString: string = format(
    `
      UPDATE 
      projects p
      SET(%I) = ROW(%L)
      WHERE p.id = $1
      RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProjects> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
  DELETE FROM projects WHERE id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).json();
};

const createTech = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const obj = {
    addedIn: new Date(),
    technologyId: res.locals.tech,
    projectId: id,
  };

  const queryInsert: string = format(
    `
  INSERT INTO projects_technologies (%I)
  VALUES (%L)
  RETURNING *;
  `,
    Object.keys(obj),
    Object.values(obj)
  );

  const queryResultInsert: QueryResult<TTechs> = await client.query(
    queryInsert
  );

  const queryString: string = `
  SELECT 
  t.id "technologyId",
  t.name AS "technologyName",
  p.id AS "projectId",
  p.name AS "projectName",
  p.description AS "projectDescription",
  p."estimatedTime" AS "projectEstimatedTime",
  p.repository AS "projectRepository",
  p."startDate" AS "projectStartDate",
  p."endDate" AS "projectEndDate"
  FROM projects p
  LEFT JOIN projects_technologies pt ON p.id = pt."projectId"
  LEFT JOIN technologies t ON t.id = pt."technologyId"
  WHERE pt.id = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResultInsert.rows[0].id],
  };

  const queryResult: QueryResult<TTechs> = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

const deleteTech = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const techId = res.locals.tech;

  const queryString: string = `
  DELETE FROM projects_technologies WHERE "projectId" = $1 AND "technologyId" = $2;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, techId],
  };

  const result: QueryResult = await client.query(queryConfig);

  if (result.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return res.status(204).json();
};

export {
  createProject,
  getProject,
  editProject,
  deleteProject,
  createTech,
  deleteTech,
};
