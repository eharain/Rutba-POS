import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authApi } from "../../lib/api";
import { fetchPurchaseByIdOrInvoice } from "../../lib/pos";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";

function ProductSearch({ value, onChange }) {
    const [query, setQuery] = useState(value?.name || "");
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        let ignore = false;
        authApi.fetch(`/api/products?name=${encodeURIComponent(query)}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (!ignore) setResults(data);
            });
        return () => { ignore = true; };
    }, [query]);

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder="Search product..."
                style={{ width: "150px" }}
            />
            {showDropdown && results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    zIndex: 10,
                    background: "#fff",
                    border: "1px solid #ccc",
                    width: "100%",
                    maxHeight: "150px",
                    overflowY: "auto",
                    margin: 0,
                    padding: 0,
                    listStyle: "none"
                }}>
                    {results.map(product => (
                        <li
                            key={product.id}
                            style={{ padding: "4px", cursor: "pointer" }}
                            onMouseDown={() => {
                                onChange(product);
                                setQuery(product.name);
                                setShowDropdown(false);
                            }}
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function PurchasePage() {
    const router = useRouter();
    const { id } = router.query;
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editItems, setEditItems] = useState([]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        try {
            const data = fetchPurchaseByIdOrInvoice(id)

            setPurchase(data);
            setEditItems(data.items?.map(item => ({
                ...item,
                product: item.product || null,
                isEditing: false
            })) || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleEdit = idx => {
        setEditItems(items =>
            items.map((item, i) =>
                i === idx ? { ...item, isEditing: true } : item
            )
        );
    };

    const handleCancel = idx => {
        setEditItems(items =>
            items.map((item, i) =>
                i === idx ? { ...item, isEditing: false } : item
            )
        );
    };

    const handleChange = (idx, field, value) => {
        setEditItems(items =>
            items.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSave = async idx => {
        const item = editItems[idx];
        // Save to backend
        try {
            const res = await authApi.put(`/api/purchase/${id}/items/${item.id}`,
                {
                    productId: item.product?.id,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice)
                }
            );
            if (!res.ok) throw new Error("Failed to update item");
            const updated = await res.json();
            setEditItems(items =>
                items.map((it, i) =>
                    i === idx ? { ...updated, product: updated.product, isEditing: false } : it
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div>Loading purchase...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!purchase) return <div>No purchase found.</div>;

    return (
        <ProtectedRoute>
            <Layout>
                <div>
                    <h1>Purchase #{purchase.id}</h1>
                    <div>
                        <strong>Supplier:</strong> {purchase.supplier?.name || "N/A"}
                    </div>
                    <div>
                        <strong>Date:</strong> {purchase.date || "N/A"}
                    </div>
                    <div>
                        <strong>Total:</strong> ${purchase.total?.toFixed(2) || "0.00"}
                    </div>
                    <h2>Items</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editItems.map((item, idx) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.isEditing ? (
                                            <ProductSearch
                                                value={item.product}
                                                onChange={prod => handleChange(idx, "product", prod)}
                                            />
                                        ) : (
                                            item.product?.name || "N/A"
                                        )}
                                    </td>
                                    <td>
                                        {item.isEditing ? (
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={e => handleChange(idx, "quantity", e.target.value)}
                                                style={{ width: "60px" }}
                                            />
                                        ) : (
                                            item.quantity
                                        )}
                                    </td>
                                    <td>
                                        {item.isEditing ? (
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={e => handleChange(idx, "unitPrice", e.target.value)}
                                                style={{ width: "80px" }}
                                            />
                                        ) : (
                                            `$${item.unitPrice?.toFixed(2) || "0.00"}`
                                        )}
                                    </td>
                                    <td>
                                        ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                                    </td>
                                    <td>
                                        {item.isEditing ? (
                                            <>
                                                <button onClick={() => handleSave(idx)}>Save</button>
                                                <button onClick={() => handleCancel(idx)}>Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEdit(idx)}>Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}