import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
   
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorM, seterrorM] = useState("");
    const [busy, setBusy] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        try {
            await login(identifier, password);
            window.location.href = "/";
        } catch (e) {
            seterrorM("Login failed" +' ' + e.message??'' );
            alert("Login failed");
            console.log("Login error:", e, identifier, password);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Layout>
            <h1>Login</h1>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
                <input placeholder="Email or Username" value={identifier} onChange={e => setIdentifier(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
                <span style={{ display: (errorM ? '' : 'none') }}>{errorM}</span>
            </form>
        </Layout>
    );
}
