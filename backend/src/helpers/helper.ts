import { Response } from "express";

export const api = async (message: any, res: Response, data: any) => {

    let response: any = {};

    response.error = false;
    response.message = message;
    response.status = 200;
    response.body = data;

    return res.status(200).json(response);
}

export const apiError = async (message: any, res: Response, data: any, status = 406) => {

    let response: any = {};

    response.error = true;
    response.message = message;
    response.status = status;
    response.body = data;

    return res.status(status).json(response);
}
