import { Request, Response } from "express";
import {
  TProjectsRequest,
  TProjectsTechs,
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
      pt."technologyId"
      FROM projects p LEFT JOIN projects_technologies pt ON p.id = pt."projectId" WHERE p.id = $1;
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

export { createProject, getProject };
