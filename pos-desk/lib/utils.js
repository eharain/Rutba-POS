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
    return (loc.desk.invoice_prefix ?? 'INV') + '-' + pad(loc.branch.id, 3, '0') + pad(loc.desk.id, 3, '0') + pad(user.id, 3, '0') + pad(Date.now(), 4, '0');
}


export function pad(value, length, char = ' ') {
    let ps = String(value ?? '').padStart(length, char); // or padEnd for right padding
    return ps.length > length * 2 ? ps.substring(0, length * 2) : ps; // truncate if too long
}