import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// Optional auth header
export function authHeaders(jwt) {
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

export async function fetchAPI(path, params = {}, jwt) {
  const res = await axios.get(`${API_URL}${path}`, {
    params,
    headers: { ...authHeaders(jwt) },
  });
  return res.data; // { data, meta } (Strapi v4)
}

export async function postAPI(path, data, jwt) {
  const res = await axios.post(`${API_URL}${path}`, data, {
    headers: { "Content-Type": "application/json", ...authHeaders(jwt) },
  });
  return res.data;
}

export async function delAPI(path, jwt) {
  const res = await axios.delete(`${API_URL}${path}`, {
    headers: { ...authHeaders(jwt) },
  });
  return res.data;
}

export async function putAPI(path, data, jwt) {
  const res = await axios.put(`${API_URL}${path}`, data, {
    headers: { "Content-Type": "application/json", ...authHeaders(jwt) },
  });
  return res.data;
}
