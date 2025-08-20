'use client';
export function getBranch() {
    const branch = localStorage.getItem("branch");
    if (branch) {
        return JSON.parse(branch);
    }
    return null;
}
export function getBranchDesk() {
    const desk = localStorage.getItem("branch-desk");
    if (desk) {
        return JSON.parse(desk);
    }
    return null;
}

export function getUser() {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
}

export function setBranch(branch) {
    localStorage.setItem("branch", JSON.stringify(branch));
}
export function setBranchDesk(desk) {
    localStorage.setItem("branch-desk", JSON.stringify(desk));
}

export function getLocation() {
    const branch = getBranch();
    const desk = getBranchDesk();
    if (!branch || !desk) {
        return null;
    }
    return {
        branch,
        desk
    };
}
export function locationString() {
    const loc = getLocation();
    if (!loc) return "No branch/desk selected";
    return `${loc.branch.name} - ${loc.desk.name}`;
}

export function generateNextInvoiceNumber() {

    const user = getUser();
    const loc = getLocation();
    if (!loc.branch || !loc.desk || !user) {
        throw new Error("Branch, desk, or user not set");
    }
    return (loc.desk.invoice_prefix ?? 'INV') +
        '-' +
        (
            padHex(loc.branch.id, 2, RandomNon22Char()) +
            padHex(loc.desk.id, 2, RandomNon22Char()) +
            padHex(user.id, 3, RandomNon22Char()) +
            padHex(Date.now(), 5, RandomNon22Char())
        );
}
export function RandomNon22Char() {
    const start = 'O'.charCodeAt(0);
    const end = 'Z'.charCodeAt(0);
    const randomCode = Math.floor(Math.random() * (end - start + 1)) + start;
    return String.fromCharCode(randomCode);
}

export function padHex(value, length, char = ' ') {
    if (typeof value === 'number') {
        value = value.toString(22).toUpperCase(); // convert to hex and uppercase
    }

    let ps = char + String(value ?? '')//.padStart(length, char); // or padEnd for right padding
    return ps.length > length * 2 ? ps.substring(0, length * 2) : ps; // truncate if too long
}