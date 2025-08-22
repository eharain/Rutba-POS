import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// ------------------ Base Helper ------------------
function authHeaders(jwt) {
    return jwt ? { Authorization: `Bearer ${jwt}` } : {};
}

async function get(path, params = {}, jwt) {
    const res = await axios.get(`${API_URL}${path}`, {
        params,
        headers: { ...authHeaders(jwt) },
    });
    return res.data; // Strapi returns { data, meta }
}

async function post(path, data, jwt) {
    const res = await axios.post(`${API_URL}${path}`, data, {
        headers: { "Content-Type": "application/json", ...authHeaders(jwt) },
    });
    return res.data;
}

async function put(path, data, jwt) {
    const res = await axios.put(`${API_URL}${path}`, data, {
        headers: { "Content-Type": "application/json", ...authHeaders(jwt) },
    });
    return res.data;
}

async function del(path, jwt) {
    const res = await axios.delete(`${API_URL}${path}`, {
        headers: { ...authHeaders(jwt) },
    });
    return res.data;
}

// ------------------ Public API (no auth) ------------------
export const api = {
    fetch: (path, params) => get(path, params),
    post: (path, data) => post(path, data),
    put: (path, data) => get(path, data),
    get: (path) => get(path),
    del: (path) => del(path),
};

// ------------------ Auth API (uses localStorage JWT) ------------------
export const authApi = {
    fetch: (path, params) => get(path, params, localStorage.getItem("jwt")),
    get: (path, data) => get(path, data, localStorage.getItem("jwt")),
    post: (path, data) => post(path, data, localStorage.getItem("jwt")),
    put: (path, data) => put(path, data, localStorage.getItem("jwt")),
    del: (path) => del(path, localStorage.getItem("jwt")),
    getUser: () => {
        const uj = localStorage.getItem("user");
        if (!uj) return null;
        let user = JSON.parse(uj);

        return user;
    },
};

export const authAPI = authApi;


export const stock_status = [
    "InStock",      // Available for sale
    "Reserved",     // Held for a customer/order but not yet sold
    "Sold",         // Already sold
    "Returned",     // Returned by customer and added back
    "ReturnedDamaged", // Returned but damaged",
    "ReturnedToSupplier", // Returned back to supplier
    "Damaged",      // Not sellable due to damage
    "Lost",         // Missing in inventory
    "Expired",      // Expired product (if applicable)
    "Transferred"   // Moved to another branch/warehouse
].reduce((pre, status) => {
    pre[status] = status;
    return pre;
}, {});

