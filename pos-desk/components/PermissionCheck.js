import { useAuth } from "../context/AuthContext";

export default function PermissionCheck({ required, children }) {
    const { permissions } = useAuth();
    const miss = required.split(',').map(perm => {
        return permissions.includes(perm.trim())
    }).filter(a => !a)

    if (miss.length > 0) {
        return <p style={{ color: "crimson", fontWeight: 600 }}>Access Denied — missing permission: {required}</p>;
    }
    return children;
}
