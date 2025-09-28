﻿import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '../../lib/api';
import { fetchSaleByIdOrInvoice } from '../../lib/pos';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import PermissionCheck from '../../components/PermissionCheck';
import SalesItemsForm from '../../components/form/sales-items-form';
import SalesItemsList from '../../components/lists/sales-items-list';

export default function SalePage() {
    const router = useRouter();
    const { id } = router.query;

    const [sale, setSale] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0
    });

    useEffect(() => {
        if (id) loadSaleData();
    }, [id]);

    useEffect(() => {
        calculateTotals();
    }, [items]);

    const loadSaleData = async () => {
        setLoading(true);
        try {
            const saleData = await fetchSaleByIdOrInvoice(id);
            setSale(saleData);
            setItems(saleData.items || []);
        } catch (error) {
            console.error('Error loading sale:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax - adjust as needed
        const total = subtotal + tax;

        setTotals({
            subtotal,
            discount: 0,
            tax,
            total
        });
    };

    const addItem = (product) => {
        const newItem = {
            product,
            quantity: 1,
            price: product.selling_price || 0,
            discount: 0,
            tax: (product.selling_price || 0) * 0.1,
            total: product.selling_price || 0
        };

        setItems(prev => [...prev, newItem]);
    };

    const updateItem = (index, updates) => {
        setItems(prev => prev.map((item, i) =>
            i === index ? { ...item, ...updates } : item
        ));
    };

    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveSaleItems(id, items);
            alert('Sale updated successfully!');
        } catch (error) {
            console.error('Error saving sale:', error);
            alert('Error saving sale');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            await saveSaleItems(id, items);

            // Update sale status to completed
            await authApi.put(`/sales/${sale.documentId || sale.id}`, {
                data: {
                    payment_status: 'Paid',
                    total: totals.total,
                    subtotal: totals.subtotal,
                    tax: totals.tax
                }
            });

            alert('Sale completed successfully!');
            router.push('/sales');
        } catch (error) {
            console.error('Error completing sale:', error);
            alert('Error completing sale');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !sale) return <div>Loading...</div>;

    return (
        <Layout>
            <ProtectedRoute>
                <PermissionCheck required='api::sale.sale.find,api::sale-item.sale-item.find,api::stock-item.stock-item.find'>
                    <div style={{ padding: '20px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <button
                                    onClick={() => router.push('/sales')}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'transparent',
                                        color: '#007bff',
                                        border: '1px solid #007bff',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginBottom: '10px'
                                    }}
                                >
                                    ← Back to Sales
                                </button>
                                <h1>Sale #{sale?.invoice_no || id}</h1>
                                <p>Date: {sale?.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}</p>
                                <p>Customer: {sale?.customer?.name || 'Walk-in Customer'}</p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    Total: ${totals.total.toFixed(2)}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading || items.length === 0}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Complete Sale
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Search Form */}
                        <SalesItemsForm
                            onAddItem={addItem}
                        />

                        {/* Items List */}
                        <SalesItemsList
                            items={items}
                            onUpdateItem={updateItem}
                            onRemoveItem={removeItem}
                        />

                        {/* Totals Summary */}
                        {items.length > 0 && (
                            <div style={{
                                marginTop: '20px',
                                padding: '20px',
                                background: '#f8f9fa',
                                borderRadius: '4px',
                                maxWidth: '300px',
                                marginLeft: 'auto'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Subtotal:</span>
                                    <span>${totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Tax:</span>
                                    <span>${totals.tax.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid #ccc', paddingTop: '8px' }}>
                                    <span>Total:</span>
                                    <span>${totals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </PermissionCheck>
            </ProtectedRoute>
        </Layout>
    );
}