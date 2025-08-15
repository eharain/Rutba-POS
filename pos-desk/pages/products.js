import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import ProtectedRoute from "../components/ProtectedRoute";
import PermissionCheck from "../components/PermissionCheck";
import { fetchAPI } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const { add } = useCart();
  const { jwt } = useAuth();

  useEffect(() => {
    (async () => {
      const res = await fetchAPI("/products", { pagination: { pageSize: 100 } }, jwt);
      setProducts(res.data || []);
    })();
  }, [jwt]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const a = p.attributes || {};
      const name = (a.name || "").toLowerCase();
      const barcode = (a.barcode || "");
      const needle = q.toLowerCase();
      return name.includes(needle) || barcode.includes(q);
    });
  }, [products, q]);

  return (
    <ProtectedRoute>
      <PermissionCheck required="api::product.product.find">
        <Layout>
          <h1>Products</h1>
          <SearchBar value={q} onChange={setQ} />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p.attributes}
                onAdd={() => add({ ...p, attributes: p.attributes })}
              />
            ))}
          </div>
        </Layout>
      </PermissionCheck>
    </ProtectedRoute>
  );
}
