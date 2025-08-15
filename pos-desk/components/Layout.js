import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav style={{ padding: "12px 16px", background: "#222", color: "#fff", display: "flex", gap: 12, alignItems: "center" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>POS</Link>
        <Link href="/products" style={{ color: "#fff" }}>Products</Link>
        <Link href="/cart" style={{ color: "#fff" }}>Cart</Link>
        <Link href="/sales" style={{ color: "#fff" }}>Sales</Link>
        <Link href="/returns" style={{ color: "#fff" }}>Returns</Link>
        <Link href="/reports" style={{ color: "#fff" }}>Reports</Link>
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hello, {user.username || user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link href="/login" style={{ color: "#fff" }}>Login</Link>
          )}
        </div>
      </nav>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}
