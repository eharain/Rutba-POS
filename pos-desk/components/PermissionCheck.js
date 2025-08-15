import { useAuth } from "../context/AuthContext";

export default function PermissionCheck({ required, children }) {
  const { permissions } = useAuth();
  if (!permissions.includes(required)) {
    return <p style={{ color: "crimson", fontWeight: 600 }}>Access Denied — missing permission: {required}</p>;
  }
  return children;
}
