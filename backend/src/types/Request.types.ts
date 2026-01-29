import { Request } from "express";

// Använd denna när du bara har URL-parametrar (t.ex. GET /students/:id)
export type TypedRequestParams<T> = Request<T>;

// Använd denna när du har en Body (t.ex. POST /login)
export type TypedRequestBody<T> = Request<void, void, T>;

// Använd denna om du har BÅDE parametrar och Body
export type TypedRequestParamsBody<Params, Body> = Request<Params, void, Body>;