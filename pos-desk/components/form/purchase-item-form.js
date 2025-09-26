import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../Table';
import { searchProduct } from '../../lib/pos';
const PurchaseItemForm = ({ purchaseItem, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        quantity: 0,
        price: 0,
        total: 0,
        product: null
    });

    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize form with purchaseItem data
    useEffect(() => {
        if (purchaseItem) {
            setFormData({
                quantity: purchaseItem.quantity || 0,
                price: purchaseItem.price || 0,
                total: purchaseItem.total || 0,
                product: purchaseItem.product || null,
                unit_price: purchaseItem.unit_price,
                bundle_units: purchaseItem.bundle_units ?? purchaseItem.product?.bundle_units??1,
            });

            if (purchaseItem.product) {
                setProductSearch(purchaseItem.product.name || '');
            }
        }
    }, [purchaseItem]);

    // Calculate total when quantity or price changes
    useEffect(() => {
        const calculatedTotal = (formData.quantity * parseFloat(formData.price)).toFixed(2);
        setFormData(prev => ({
            ...prev,
            total: parseFloat(calculatedTotal)
        }));
    }, [formData.quantity, formData.price]);

    // Search products with debounce
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
        setLoading(true);
        try {
            const productResult = await searchProduct(searchText);
            setSearchResults(productResult);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0
        }));
    };

    const handleProductSelect = (product) => {

        let price = product.cost_price || 0;//formData.price;
        price = parseFloat(price);
        if (price > 0) {
            price = price - 5 * (price / 100)
        } else {
            price = formData.price;
        }

        setFormData(prev => ({
            ...prev,
            price,
            product: product
        }));
        setProductSearch(product.name);
        setShowResults(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        
        <TableRow>
            <TableCell>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product..."
                        style={{
                            width: '100%',
                            padding: '4px 8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />

                    {loading && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #ccc',
                            padding: '4px',
                            zIndex: 10
                        }}>
                            Searching...
                        </div>
                    )}

                    {showResults && searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid #ccc',
                            maxHeight: '150px',
                            overflowY: 'auto',
                            zIndex: 10
                        }}>
                            {searchResults.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductSelect(product)}
                                    style={{
                                        padding: '8px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    {product.name}
                                    {product.barcode && (
                                        <span style={{ color: '#666', marginLeft: '8px' }}>
                                            ({product.barcode})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {formData.product && (
                        <div style={{ fontSize: '12px', color: 'green', marginTop: '4px' }}>
                            Selected: <strong>{formData.product.name}({formData.product.cost_price})</strong>
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell align="center">
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    style={{
                        width: '80px',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}
                    required
                />
                <br />
                {formData.product?.bundle_units > 0 && (<span style={{ color: '#666', marginLeft: '8px' }}>
                    bundle of  {formData.product?.bundle_units}
                </span>
                )}
            </TableCell>

            <TableCell align="center">
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    style={{
                        width: '100px',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}
                    required
                />
            </TableCell>

            <TableCell align="center">
                <input
                    type="number"
                    value={formData.total}
                    readOnly
                    style={{
                        width: '100px',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#f5f5f5',
                        textAlign: 'center'
                    }}
                />
            </TableCell>

            <TableCell align="center">
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            padding: '4px 12px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: '4px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </TableCell>
        </TableRow>

    );
};



export default PurchaseItemForm;

export function PurchaseItemFormTable({ children }) {

    return (<Table>
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
            {children}
        </TableBody>
    </Table>
    )
}