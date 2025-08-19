import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { locationString } from "../lib/utils";
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
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hello, {user.username || user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link href="/login" style={{ color: "#fff" }}>Login</Link>
          )}
          <Link href="/settings" style={{ color: "#fff", display: "flex", alignItems: "center", marginLeft: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>
        </div>
      </nav>
          <main style={{ padding: 16 }}>{children}</main>
          <footer style={{ padding: "12px 16px", background: "#222", color: "#fff", textAlign: "center" }}>
              {locationString()}
          </footer>
      </div>
  );
}
