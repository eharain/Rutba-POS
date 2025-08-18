import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bootstrap from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedJwt = localStorage.getItem("jwt");
        const storedPerms = localStorage.getItem("permissions");
        if (storedUser && storedJwt) {
            setUser(JSON.parse(storedUser));
            setJwt(storedJwt);
            setPermissions(JSON.parse(storedPerms || "[]"));
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        const base = (process.env.NEXT_PUBLIC_API_URL || "");//.replace("/api", "");
        const authRes = await axios.post(`${base}/auth/local`, { identifier, password });
        const { user, jwt } = authRes.data;

        setUser(user);
        setJwt(jwt);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("jwt", jwt);

        // Fetch role name
        //api/users - permissions / permissions
        const me = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/me/permissions`, { time: (new Date()).getMilliseconds() }, {
            headers: { Authorization: `Bearer ${jwt}` }
        });

      //  console.log('mep', me.data);

        const roleName = me?.data?.role;

        setPermissions(me?.data.permissions);

        localStorage.setItem("permissions", JSON.stringify(me?.data.permissions));
    };

    const logout = () => {
        setUser(null);
        setJwt(null);
        setPermissions([]);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
        localStorage.removeItem("permissions");
    };

    return (
        <AuthContext.Provider value={{ user, jwt, permissions, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
