import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchPurchaseByIdDocumentIdOrPO } from '../../lib/pos';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import PermissionCheck from '../../components/PermissionCheck';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/Table';
import StrapiImage from '../../components/StrapiImage';

export default function PurchaseViewPage() {
    const router = useRouter();
    const { id } = router.query;

    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) loadPurchaseData();
    }, [id]);

    const loadPurchaseData = async () => {
        setLoading(true);
        try {
            const purchaseData = await fetchPurchaseByIdDocumentIdOrPO(id);
            if (!purchaseData) {
                setError('Purchase not found');
            } else {
                setPurchase(purchaseData);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error loading purchase:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft': return '#6c757d';
            case 'Pending': return '#ffc107';
            case 'Submitted': return '#17a2b8';
            case 'Partially Received': return '#fd7e14';
            case 'Received': return '#28a745';
            case 'Closed': return '#20c997';
            case 'Cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getApprovalStatusColor = (status) => {
        switch (status) {
            case 'Draft': return '#6c757d';
            case 'Pending Approval': return '#ffc107';
            case 'Not Required': return '#17a2b8';
            case 'Approved': return '#28a745';
            case 'Rejected': return '#dc3545';
            case 'Revised': return '#fd7e14';
            default: return '#6c757d';
        }
    };

    const calculatePurchaseTotals = () => {
        if (!purchase?.items) return { total: 0, itemCount: 0 };

        const total = purchase.items.reduce((sum, item) => {
            const itemTotal = (item.quantity || 0) * (item.unit_price || item.price || 0);
            return sum + itemTotal;
        }, 0);

        return {
            total,
            itemCount: purchase.items.length
        };
    };

    const handleEdit = () => {
        router.push(`/${id}/purchase`);
    };

    const handleReceive = () => {
        router.push(`/${id}/receive`);
    };

    const handleBack = () => {
        router.push('/purchases');
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div>Loading purchase details...</div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>
                        <button
                            onClick={handleBack}
                            style={{
                                padding: '10px 20px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Back to Purchases
                        </button>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!purchase) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px' }}>Purchase not found</div>
                        <button
                            onClick={handleBack}
                            style={{
                                padding: '10px 20px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Back to Purchases
                        </button>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    const totals = calculatePurchaseTotals();

    return (
        <ProtectedRoute>
            <Layout>
                <PermissionCheck required="api::purchase.purchase.find">
                    <div style={{ padding: '20px' }}>
                        {/* Header Actions */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={handleBack}
                                style={{
                                    padding: '8px 16px',
                                    background: 'transparent',
                                    color: '#007bff',
                                    border: '1px solid #007bff',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                ← Back to Purchases
                            </button>

                            <button
                                onClick={handleEdit}
                                style={{
                                    padding: '8px 16px',
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Edit Purchase
                            </button>

                            {purchase.status !== 'Received' && purchase.status !== 'Cancelled' && (
                                <button
                                    onClick={handleReceive}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Receive Items
                                </button>
                            )}
                        </div>

                        {/* Purchase Header */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #dee2e6'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                        Purchase Order: {purchase.purchase_no}
                                    </h1>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                        <div>
                                            <strong>Order Date:</strong><br />
                                            {purchase.order_date ? new Date(purchase.order_date).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div>
                                            <strong>Received Date:</strong><br />
                                            {purchase.order_recieved_date ? new Date(purchase.order_recieved_date).toLocaleDateString() : 'Not received'}
                                        </div>
                                        <div>
                                            <strong>Suppliers:</strong><br />
                                            {purchase.suppliers?.length > 0
                                                ? purchase.suppliers.map(s => s.name).join(', ')
                                                : 'No suppliers'
                                            }
                                        </div>
                                        <div>
                                            <strong>Total Items:</strong><br />
                                            {totals.itemCount} items
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            backgroundColor: getStatusColor(purchase.status),
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {purchase.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            backgroundColor: getApprovalStatusColor(purchase.approval_status),
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {purchase.approval_status || 'Draft'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px', color: '#28a745' }}>
                                        ${totals.total.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Items */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ marginBottom: '15px', color: '#333' }}>Purchase Items</h2>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Unit Price</TableCell>
                                        <TableCell align="center">Bundle Units</TableCell>
                                        <TableCell align="center">Subtotal</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {purchase.items?.length > 0 ? (
                                        purchase.items.map((item, index) => {
                                            const itemTotal = (item.quantity || 0) * (item.unit_price || item.price || 0);
                                            const receivedPercentage = item.quantity > 0
                                                ? Math.round(((item.received_quantity || 0) / item.quantity) * 100)
                                                : 0;

                                            return (
                                                <TableRow key={item.documentId || index}>
                                                    <TableCell>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            {item.product?.logo && (
                                                                <StrapiImage
                                                                    media={item.product.logo}
                                                                    format="thumbnail"
                                                                    maxWidth={40}
                                                                    maxHeight={40}
                                                                />
                                                            )}
                                                            <div>
                                                                <strong>{item.product?.name || 'N/A'}</strong>
                                                                {item.product?.barcode && (
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                                        Barcode: {item.product.barcode}
                                                                    </div>
                                                                )}
                                                                {item.product?.sku && (
                                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                                        SKU: {item.product.sku}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div>
                                                            <strong>{item.quantity || 0}</strong>
                                                            {item.received_quantity > 0 && (
                                                                <div style={{ fontSize: '12px', color: '#28a745' }}>
                                                                    Received: {item.received_quantity}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        ${(item.unit_price || item.price || 0).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {item.bundle_units > 1 ? item.bundle_units : '1'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <strong>${itemTotal.toFixed(2)}</strong>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            backgroundColor: item.status === 'Received' ? '#28a745' :
                                                                item.received_quantity > 0 ? '#fd7e14' : '#6c757d',
                                                            color: 'white',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {item.status || 'Pending'}
                                                        </span>
                                                        {item.quantity > 0 && (
                                                            <div style={{
                                                                marginTop: '4px',
                                                                background: '#e9ecef',
                                                                borderRadius: '4px',
                                                                height: '6px',
                                                                overflow: 'hidden'
                                                            }}>
                                                                <div
                                                                    style={{
                                                                        height: '100%',
                                                                        background: receivedPercentage === 100 ? '#28a745' :
                                                                            receivedPercentage > 0 ? '#fd7e14' : '#6c757d',
                                                                        width: `${receivedPercentage}%`,
                                                                        transition: 'width 0.3s ease'
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" style={{ padding: '40px', color: '#666' }}>
                                                No items found in this purchase order.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Receipts and Documents */}
                        {(purchase.receipts?.length > 0 || purchase.gallery?.length > 0) && (
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{ marginBottom: '15px', color: '#333' }}>Documents & Receipts</h2>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {purchase.receipts?.map((receipt, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #dee2e6',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            width: '120px'
                                        }}>
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                background: '#f8f9fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '4px',
                                                marginBottom: '8px'
                                            }}>
                                                <i className="fas fa-file" style={{ fontSize: '24px', color: '#6c757d' }}></i>
                                            </div>
                                            <div style={{ fontSize: '12px', wordBreak: 'break-word' }}>
                                                {receipt.name || `Receipt ${index + 1}`}
                                            </div>
                                        </div>
                                    ))}

                                    {purchase.gallery?.map((image, index) => (
                                        <div key={index} style={{
                                            border: '1px solid #dee2e6',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            width: '120px'
                                        }}>
                                            <StrapiImage
                                                media={image}
                                                format="thumbnail"
                                                maxWidth={100}
                                                maxHeight={100}
                                                imgProps={{ style: { borderRadius: '4px' } }}
                                            />
                                            <div style={{ fontSize: '12px', marginTop: '8px', wordBreak: 'break-word' }}>
                                                {image.name || `Image ${index + 1}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#333' }}>Purchase Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                <div>
                                    <strong>Total Items:</strong> {totals.itemCount}
                                </div>
                                <div>
                                    <strong>Total Value:</strong> ${totals.total.toFixed(2)}
                                </div>
                                <div>
                                    <strong>Created:</strong> {purchase.createdAt ? new Date(purchase.createdAt).toLocaleString() : 'N/A'}
                                </div>
                                <div>
                                    <strong>Last Updated:</strong> {purchase.updatedAt ? new Date(purchase.updatedAt).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </PermissionCheck>
            </Layout>
        </ProtectedRoute>
    );
}