import { Response } from "express";

interface IResponseData {
    [key: string]: unknown;
}

export const responseSending = (
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: IResponseData = {}
) => {
    res.status(statusCode).json({
        success,
        message,
        data
    });
}