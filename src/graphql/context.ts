import { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request;
  res: Response;
}

export const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> => {
  return {
    req,
    res
  };
}; 