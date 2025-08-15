import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import PermissionCheck from "../components/PermissionCheck";
import { fetchAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const { jwt } = useAuth();

  useEffect(() => {
    (async () => {
      const res = await fetchAPI("/sales", { sort: ["id:desc"], pagination: { pageSize: 100 } }, jwt);
      setSales(res.data || []);
    })();
  }, [jwt]);

  return (
    <ProtectedRoute>
      <PermissionCheck required="api::sale.sale.find">
        <Layout>
          <h1>Sales</h1>
          {sales.length === 0 && <p>No sales yet.</p>}
          {sales.map(s => (
            <div key={s.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <div><b>Sale #{s.id}</b></div>
              <div>Total: ${s.attributes?.total}</div>
              <div>Date: {new Date(s.attributes?.sale_date).toLocaleString()}</div>
            </div>
          ))}
        </Layout>
      </PermissionCheck>
    </ProtectedRoute>
  );
}
