import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import PermissionCheck from "../components/PermissionCheck";
import { fetchAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { jwt, permissions } = useAuth();
  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    (async () => {
      if (permissions.includes("api::sale.sale.find")) {
        const s = await fetchAPI("/sales", { pagination: { pageSize: 200 } }, jwt);
        setSales(s.data || []);
      }
      if (permissions.includes("api::sale-return.sale-return.find")) {
        const r = await fetchAPI("/sale-returns", { pagination: { pageSize: 200 } }, jwt);
        setReturns(r.data || []);
      }
    })();
  }, [jwt, permissions]);

  const totals = useMemo(() => {
    const salesTotal = sales.reduce((sum, s) => sum + (+s.attributes?.total || 0), 0);
    const returnTotal = returns.reduce((sum, r) => sum + (+r.attributes?.total_refund || 0), 0);
    return { salesTotal, returnTotal };
  }, [sales, returns]);

  return (
    <ProtectedRoute>
      <Layout>
        <h1>Reports</h1>
        <PermissionCheck required="api::sale.sale.find">
          <h3>Sales</h3>
          <div>Count: {sales.length}</div>
          <div>Total: ${totals.salesTotal.toFixed(2)}</div>
        </PermissionCheck>

        <PermissionCheck required="api::sale-return.sale-return.find">
          <h3 style={{ marginTop: 16 }}>Returns</h3>
          <div>Count: {returns.length}</div>
          <div>Total Refund: ${totals.returnTotal.toFixed(2)}</div>
        </PermissionCheck>
      </Layout>
    </ProtectedRoute>
  );
}
