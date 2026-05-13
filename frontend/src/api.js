import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  const url = config.url || "";

  // Public endpoints that don't need auth
  const isPublic = url.includes("login/")
    || url.includes("public-lead")
    || (url.includes("hotels/") && config.method === "get" && !url.includes("dashboard/") && !url.includes("hotels/admin/"))
    || url.includes("hotels/packages/")
    || url.includes("hotels/book/")
    || url.includes("hotels/booking/")
    || url.includes("popular-cities");

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;