import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL : "http://localhost:8080/api/v1";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };