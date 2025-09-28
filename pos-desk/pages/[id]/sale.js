import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '../../lib/api';
import { fetchSaleByIdOrInvoice, searchProduct, saveSaleItems } from '../../lib/pos';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import PermissionCheck from '../../components/PermissionCheck';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/Table';

export default function SalePage() {
    const router = useRouter();
    const { id } = router.query;

    const [sale, setSale] = useState(null);
    const [items, setItems] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
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

    // Product search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (productSearch.length > 2) {
                handleProductSearch(productSearch);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [productSearch]);

    const handleProductSearch = async (searchText) => {
        try {
            const productResult = await searchProduct(searchText);
            setSearchResults(productResult);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        }
    };

    const handleProductSelect = (product) => {
        const newItem = {
            product,
            quantity: 1,
            price: product.selling_price || 0,
            discount: 0,
            tax: (product.selling_price || 0) * 0.1,
            total: product.selling_price || 0
        };

        setItems(prev => [...prev, newItem]);
        setProductSearch('');
        setShowResults(false);
    };

    const updateItem = (index, updates) => {
        setItems(prev => prev.map((item, i) =>
            i === index ? { ...item, ...updates } : item
        ));
    };

    const removeItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (index, quantity) => {
        const item = items[index];
        const newQuantity = Math.max(1, quantity);
        const newTotal = item.price * newQuantity;

        updateItem(index, {
            quantity: newQuantity,
            total: newTotal
        });
    };

    const handlePriceChange = (index, price) => {
        const item = items[index];
        const newPrice = Math.max(0, price);
        const newTotal = newPrice * item.quantity;

        updateItem(index, {
            price: newPrice,
            total: newTotal
        });
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

                        {/* Product Search - Fast POS Entry */}
                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Scan barcode or search product..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '16px',
                                    border: '2px solid #007bff',
                                    borderRadius: '4px'
                                }}
                                autoFocus
                            />

                            {showResults && searchResults.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {searchResults.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductSelect(product)}
                                            style={{
                                                padding: '12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.background = 'white'}
                                        >
                                            <div>
                                                <strong>{product.name}</strong>
                                                {product.barcode && (
                                                    <span style={{ color: '#666', marginLeft: '10px' }}>
                                                        ({product.barcode})
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                                                ${product.selling_price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Items Table - Fast Editing */}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <strong>{item.product?.name}</strong>
                                            {item.product?.barcode && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    SKU: {item.product.sku}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                                style={{
                                                    width: '80px',
                                                    padding: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.price}
                                                onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                                                style={{
                                                    width: '100px',
                                                    padding: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>${item.total.toFixed(2)}</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <button
                                                onClick={() => removeItem(index)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {items.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>No items added to sale. Search for products above to add items.</p>
                            </div>
                        )}

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