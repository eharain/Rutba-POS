import { useAuth } from "../context/AuthContext";
import dynamic from 'next/dynamic';

export function PermissionCheck({ required, has, children }) {

    const { permissions } = useAuth();
    function findMissing(required) {
        const permCheck = (required?.trim()?.split(',') ?? '');
        const miss = permCheck.filter(perm => {
            return !permissions.includes(perm.trim())
        }).filter(a => !a)
        return miss;
    }
    if (required) {
        const miss = findMissing(required);
        if (miss.length > 0) {
            return <p style={{ color: "crimson", fontWeight: 600 }}>
                Access Denied — missing permission: {miss.length} Required    {permCheck}
                {miss.map((perm, i) => {
                    return <span key={i} className="badge bg-danger ms-1">{perm}</span>;
                })}
            </p>

        }
    } else if (has) {
        const miss = findMissing(has);
        if (miss.length > 0) {
            return '';
        }
    } else {
        return <p style={{ color: "crimson", fontWeight: 600 }}>Access Denied —PermissionChek has no required or requested has permission </p>;
    }
    return children;
}


export default dynamic(() => Promise.resolve(PermissionCheck), { ssr: false });