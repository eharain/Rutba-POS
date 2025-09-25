import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authApi } from "../../lib/api";
import { fetchPurchaseByIdDocumentIdOrPO, fetchEnumsValues, savePurchaseItem } from "../../lib/pos";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../../components/Table";
import PurchaseItemsList from "../../components/lists/purchase-items-list";
import PurchaseItemForm from "../../components/form/purchase-item-form";

export default function PurchasePage() {
    const router = useRouter();
    const { id } = router.query;
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editItems, setEditItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [purchaseStatuses, setPurchaseStatuses] = useState([]);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const [purchaseData, statuses] = await Promise.all([
                    fetchPurchaseByIdDocumentIdOrPO(id),
                    fetchEnumsValues("purchase", "status")
                ]);

                setPurchase(purchaseData);
                setPurchaseStatuses(statuses || []);
                setEditItems(purchaseData.items?.map(item => ({
                    ...item,
                    product: item.product || null,
                    // Handle different field names from your API
                    price: item.unit_price || item.price || 0,
                    quantity: item.quantity || 0,
                    total: (item.quantity || 0) * (item.unit_price || item.price || 0)
                })) || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleEdit = (itemId) => {
        setEditingItemId(itemId);
    };

    const handleCancel = () => {
        setEditingItemId(null);
    };

    const handleSave = async (updatedData) => {
        try {
            const itemToUpdate = editItems.find(item => item.id === editingItemId);
            if (!itemToUpdate) throw new Error("Item not found");

            const res = await authApi.put(`/purchase/${purchase.id}/items/${editingItemId}`, {
                productId: updatedData.product?.id,
                quantity: Number(updatedData.quantity),
                unitPrice: Number(updatedData.price)
            });

            if (!res.ok) throw new Error("Failed to update item");

            const updatedItem = await res.json();

            setEditItems(items =>
                items.map(item =>
                    item.id === editingItemId
                        ? {
                            ...updatedItem,
                            product: updatedItem.product || updatedData.product,
                            price: updatedItem.unit_price || updatedItem.price,
                            total: (updatedItem.quantity || 0) * (updatedItem.unit_price || updatedItem.price || 0)
                        }
                        : item
                )
            );

            setEditingItemId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const res = await authApi.put(`/purchases/${purchase.id}`, {
                status: newStatus
            });

            //if (!res.ok) throw new Error("Failed to update status");

            //const updatedPurchase = await res.json();
            //setPurchase(updatedPurchase);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddNewItem = () => {
        const newItem = {
            id: `temp-${Date.now()}`,
            quantity: 1,
            price: 0,
            total: 0,
            product: null,
            isNew: true
        };
        setEditItems(prev => [...prev, newItem]);
        setEditingItemId(newItem.id);
    };

    const handleSaveNewItem = async (newItemData) => {
        try {
            const data = {
                product: newItemData.product,
                purchase: purchase,
                quantity: Number(newItemData.quantity),
                unitPrice: Number(newItemData.price)
            }
            const savedItem = await savePurchaseItem(data);


            //const res = await authApi.post(`/purchase/${purchase.documentId}/items`, {
            //    productId: newItemData.product?.id,
            //    quantity: Number(newItemData.quantity),
            //    unitPrice: Number(newItemData.price)
            //});

            //if (!res.ok) throw new Error("Failed to add new item");

            //const savedItem = await res.json();

            setEditItems(items =>
                items.map(item =>
                    item.id === editingItemId
                        ? {
                            ...savedItem,
                            product: savedItem.product || newItemData.product,
                            price: savedItem.unit_price || savedItem.price,
                            total: (savedItem.quantity || 0) * (savedItem.unit_price || savedItem.price || 0)
                        }
                        : item
                )
            );

            setEditingItemId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await authApi.del(`/api/purchase-items/${itemId}`);
            if (!res.ok) throw new Error("Failed to delete item");

            setEditItems(items => items.filter(item => item.id !== itemId));
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#f5c542";
            case "Submitted": return "#42a5f5";
            case "Received": return "#66bb6a";
            case "Cancelled": return "#ef5350";
            default: return "#9e9e9e";
        }
    };

    if (loading) return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading purchase...</div>
            </Layout>
        </ProtectedRoute>
    );

    if (error) return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>
            </Layout>
        </ProtectedRoute>
    );

    if (!purchase) return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: '20px' }}>No purchase found.</div>
            </Layout>
        </ProtectedRoute>
    );

    return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: '20px' }}>
                    {/* Back to Purchases List */}
                    <div style={{ marginBottom: '20px' }}>
                        <button
                            onClick={() => router.push('/purchases')}
                            style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                color: '#007bff',
                                border: '1px solid #007bff',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Purchases
                        </button>
                    </div>

                    <h1>Purchase #{purchase.purchase_no || purchase.id}</h1>

                    {/* Purchase Header Info */}
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '4px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px'
                    }}>
                        <div><strong>Supplier:</strong> {purchase.supplier?.name || "N/A"}</div>
                        <div><strong>Date:</strong> {purchase.order_date || purchase.date || "N/A"}</div>
                        <div><strong>Invoice:</strong> {purchase.invoice || "N/A"}</div>
                        <div>
                            <strong>Status:</strong>
                            <select
                                value={purchase.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                style={{
                                    marginLeft: '8px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc'
                                }}
                            >
                                {purchaseStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div><strong>Total:</strong> ${parseFloat(purchase.total || 0).toFixed(2)}</div>
                    </div>

                    <h2>Items</h2>

                    {/* Purchase Items List */}
                    <PurchaseItemsList
                        purchaseItems={editItems}
                        editingItemId={editingItemId}
                        onEditItem={handleEdit}
                        onDeleteItem={handleDeleteItem}
                        onSaveItem={handleSave}
                        onCancelEdit={handleCancel}
                    />

                    {/* Add New Item Button */}
                    {!editingItemId && (
                        <div style={{ marginTop: '20px' }}>
                            <button
                                onClick={handleAddNewItem}
                                style={{
                                    padding: '8px 16px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                + Add New Item
                            </button>
                        </div>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}