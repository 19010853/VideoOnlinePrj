import type { AxiosRequestConfig } from "axios";

export interface IFormData {
    email: string;
    password: string;
}

export interface IConfigUsingAxios extends AxiosRequestConfig {
    headers: {
        Authorization: string;
    }
}