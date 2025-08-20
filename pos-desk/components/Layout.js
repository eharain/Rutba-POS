import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { locationString } from "../lib/utils";

export default function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div>

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <Link className="navbar-brand fw-bold" href="/">Rutba POS</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" href="/products">Products</Link></li>
                        <li className="nav-item"><Link className="nav-link" href="/cart">Cart</Link></li>
                        <li className="nav-item"><Link className="nav-link" href="/sales">Sales</Link></li>
                        <li className="nav-item"><Link className="nav-link" href="/returns">Returns</Link></li>
                        <li className="nav-item"><Link className="nav-link" href="/reports">Reports</Link></li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <span className="text-white me-3">Hello, {user.username || user.email}</span>
                                <button className="btn btn-outline-light btn-sm me-2" onClick={logout}>Logout</button>
                            </>
                        ) : (
                            <Link className="btn btn-outline-light btn-sm me-2" href="/login">Login</Link>
                        )}
                        <Link className="nav-link text-white" href="/settings" title="Settings">
                            <i className="fas fa-cog"></i>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Secondary Navigation */}
            <nav className="navbar navbar-expand navbar-light bg-light px-3 py-1 border-bottom">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" href="/new/sales/">New Sale</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/new/Return">New Return</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/New Purchase">New Purchase</Link>
                    </li>
                </ul>
            </nav>

            <main className="container py-3">{children}</main>
            <footer className="bg-dark text-white text-center py-3">
                {locationString()}
            </footer>

        </div>
    );
}
