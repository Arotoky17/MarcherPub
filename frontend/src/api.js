import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API,
  withCredentials: true // utile si tu utilises cookies/sessions
});
