import { useAuth } from "../context/AuthContext";

export default function PermissionCheck({ required, children }) {

    const { permissions } = useAuth();
    const perms = (required?.trim()?.split(',') ?? '');

    const miss = perms.filter(perm => {
        return !permissions.includes(perm.trim())
    }).filter(a => !a)
    if (!required) {
        return <p style={{ color: "crimson", fontWeight: 600 }}>Access Denied —PermissionChek has no  required permission </p>;
    }
    if (miss.length > 0) {
        return <p style={{ color: "crimson", fontWeight: 600 }}>Access Denied — missing permission:
            {perms} {miss.length}
            {miss.map((perm, i) => {
                return <span key={i} className="badge bg-danger ms-1">{perm}</span>;
            })}
        </p>
            ;
    }

    return children;
}
