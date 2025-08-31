import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import PermissionCheck from "../components/PermissionCheck";
import { authApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Returns() {
    const [sales, setSales] = useState([]);
    const { jwt, permissions } = useAuth();

    useEffect(() => {
        (async () => {
            // populate sale->items->product
            const res = await authApi.fetch("/sales", {
                populate: {
                    items: { populate: ["product"] }
                },
                pagination: { pageSize: 50 },
                sort: ["id:desc"]
            }, jwt);
            setSales(res.data || []);
        })();
      
    }, [jwt]);

    async function createSaleReturn(saleId, productId, quantity, price) {
        if (!permissions.includes("api::sale-return.sale-return.create")) {
            alert("No permission to create sale returns.");
            return;
        }
        // 1) create sale-return
        const ret = await authApi.post("/sale-returns", {
            data: {
                return_date: new Date().toISOString(),
                total_refund: price * quantity,
                sale: saleId,
                notes: "POS return"
            }
        }, jwt);
        const retId = ret?.data?.id;
        if (!retId) return alert("Failed to create return header.");

        // 2) create sale-return-item
        await authApi.post("/sale-return-items", {
            data: {
                quantity,
                price,
                total: price * quantity,
                product: productId,
                sale_return: retId
            }
        }, jwt);

        alert(`Return #${retId} created`);
    }

    return (
        <ProtectedRoute>
            <PermissionCheck required="api::sale.sale.find">
                <Layout>
                    <h1>Returns</h1>
                    {sales.map(s => (
                        <div key={s.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, marginBottom: 10 }}>
                            <div><b>Sale #{s.id}</b> — {new Date(s.attributes?.sale_date).toLocaleString()}</div>
                            {(s.attributes?.items?.data || []).map(it => {
                                const prod = it?.attributes?.product?.data;
                                const price = it?.attributes?.price ?? prod?.attributes?.selling_price ?? 0;
                                return (
                                    <div key={it.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
                                        <div style={{ flex: 1 }}>{prod?.attributes?.name}</div>
                                        <small>${price}</small>
                                        <PermissionCheck required="api::sale-return.sale-return.create">
                                            <button onClick={() => createSaleReturn(s.id, prod.id, 1, price)}>Return 1</button>
                                        </PermissionCheck>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </Layout>
            </PermissionCheck>
        </ProtectedRoute>
    );
}
