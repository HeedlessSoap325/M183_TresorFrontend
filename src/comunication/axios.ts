import axios from "axios";

const protocol = import.meta.env.VITE_API_PROTOCOL; // "http"
const host = import.meta.env.VITE_API_HOST; // "localhost"
const port = import.meta.env.VITE_API_PORT; // "8080"
const path = import.meta.env.VITE_API_PATH; // "/api"
const portPart = port ? `:${port}` : ''; // port is optional
export const API_URL = `${protocol}://${host}${portPart}${path}`;

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});