import { Request, Response } from "express";
import {
  TDeveloperInfos,
  TDeveloperInfosRequest,
  TDevelopers,
  TDevelopersRequest,
} from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TDevelopersRequest = req.body;

  const queryString: string = format(
    `
    INSERT INTO developers(%I) VALUES (%L)
    RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const getDeveloper = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
  SELECT
    developers.id AS "developerId",
    developers.name AS "developerName",
    developers.email AS "developerEmail",
    developer_infos."developerSince" AS "developerInfoDeveloperSince",
    developer_infos."preferredOS" AS "developerInfoPreferredOS"
  FROM
    developers
  LEFT JOIN
    developer_infos ON developers.id = developer_infos."developerId"
  WHERE
    developers.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows);
};

const createDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TDeveloperInfosRequest = req.body;
  const id: number = parseInt(req.params.id);

  const queryCheck = `
  select "preferredOS" from developer_infos where "developerId" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryCheck,
    values: [id],
  };

  const result: QueryResult<TDeveloperInfos> = await client.query(queryConfig);
  if (result.rowCount === 1) {
    return res.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  if (data.preferredOS !== "Windows" || "Linux" || "MacOS") {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const newObj: Partial<TDeveloperInfos> = {
    ...data,
    developerId: id,
  };

  const queryString: string = format(
    `
    INSERT INTO developer_infos(%I) VALUES(%L)
    RETURNING *;
  `,
    Object.keys(newObj),
    Object.values(newObj)
  );

  const queryResult: QueryResult<TDeveloperInfos> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data: TDevelopersRequest = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
  UPDATE developers SET(%I) = ROW(%L) WHERE id = $1
  RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );

  const queriConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevelopers> = await client.query(queriConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
  DELETE FROM developers WHERE id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).json();
};

export {
  createDeveloper,
  getDeveloper,
  createDeveloperInfo,
  updateDeveloper,
  deleteDeveloper,
};
