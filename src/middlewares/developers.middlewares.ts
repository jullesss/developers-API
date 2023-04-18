import { NextFunction, Request, Response } from "express";
import {
  TDevelopers,
  TDevelopersRequest,
} from "../interfaces/developers.interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const devData: TDevelopersRequest = req.body;

  const queryString: string = `
    SELECT * FROM developers
    WHERE email = $1
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devData.email],
  };

  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
  if (queryResult.rows[0]) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  return next();
};

const ensureIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  if (
    (req.route.path === "/projects" && req.method === "POST") ||
    (req.route.path === "/projects/:id" && req.method === "PATCH")
  ) {
    id = req.body.developerId;
  }

  const queryString: string = `
  SELECT * FROM developers
  WHERE id = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

export { checkEmail, ensureIdExists };
