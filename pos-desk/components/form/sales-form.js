// /pos-desk/components/form/sales-form.js
import React, { useState, useEffect } from 'react';
import { authApi } from '../../lib/api';
import { useUtil } from '../../context/UtilContext';
import SalesItemForm from './sales-item-form';

const SalesForm = ({ sale, onSubmit, onCancel }) => {
    const { generateNextInvoiceNumber, branch, desk, user } = useUtil();
    const [formData, setFormData] = useState({
        invoice_no: '',
        sale_date: new Date().toISOString().split('T')[0],
        customer: null,
        employee: null,
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        payment_status: 'Unpaid'
    });
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sale) {
            setFormData({
                invoice_no: sale.invoice_no || '',
                sale_date: sale.sale_date?.split('T')[0] || new Date().toISOString().split('T')[0],
                customer: sale.customer || null,
                employee: sale.employee || null,
                subtotal: sale.subtotal || 0,
                discount: sale.discount || 0,
                tax: sale.tax || 0,
                total: sale.total || 0,
                payment_status: sale.payment_status || 'Unpaid'
            });
            setItems(sale.items || []);
        } else {
            setFormData(prev => ({
                ...prev,
                invoice_no: generateNextInvoiceNumber()
            }));
        }
        loadCustomers();
        loadEmployees();
    }, [sale]);

    useEffect(() => {
        // Calculate totals when items change
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // Example: 10% tax
        const total = subtotal + tax - formData.discount;

        setFormData(prev => ({
            ...prev,
            subtotal,
            tax,
            total
        }));
    }, [items, formData.discount]);

    const loadCustomers = async () => {
        try {
            const response = await authApi.get('/customers');
            setCustomers(response.data || []);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await authApi.get('/employees');
            setEmployees(response.data || []);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    const addItem = (product, quantity = 1) => {
        const newItem = {
            product,
            quantity,
            price: product.selling_price,
            discount: 0,
            tax: product.selling_price * 0.1, // Example tax calculation
            total: product.selling_price * quantity
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const saleData = {
                ...formData,
                customer: formData.customer ? { connect: [formData.customer.documentId || formData.customer.id] } : undefined,
                employee: formData.employee ? { connect: [formData.employee.documentId || formData.employee.id] } : undefined,
                items: { connect: items.map(item => item.documentId || item.id) },
                users: { connect: [user.id] },
                branches: { connect: [branch.documentId || branch.id] }
            };

            if (sale?.documentId) {
                await authApi.put(`/sales/${sale.documentId}`, { data: saleData });
            } else {
                await authApi.post('/sales', { data: saleData });
            }

            onSubmit && onSubmit();
        } catch (error) {
            console.error('Error saving sale:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <h2>{sale ? 'Edit Sale' : 'Create Sale'}</h2>

            <form onSubmit={handleSubmit}>
                {/* Sale Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label>Invoice Number:</label>
                        <input
                            type="text"
                            name="invoice_no"
                            value={formData.invoice_no}
                            onChange={(e) => setFormData(prev => ({ ...prev, invoice_no: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label>Sale Date:</label>
                        <input
                            type="date"
                            name="sale_date"
                            value={formData.sale_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, sale_date: e.target.value }))}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div>
                        <label>Customer:</label>
                        <select
                            value={formData.customer?.id || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                customer: customers.find(c => c.id == e.target.value)
                            }))}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} - {customer.phone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Employee:</label>
                        <select
                            value={formData.employee?.id || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                employee: employees.find(e => e.id == e.target.value)
                            }))}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name} - {employee.role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sale Items */}
                <SalesItemForm
                    items={items}
                    onAddItem={addItem}
                    onUpdateItem={updateItem}
                    onRemoveItem={removeItem}
                />

                {/* Totals */}
                <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Subtotal:</span>
                        <span>${formData.subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Discount:</span>
                        <span>${formData.discount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Tax:</span>
                        <span>${formData.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                        <span>Total:</span>
                        <span>${formData.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}
                    >
                        {loading ? 'Saving...' : (sale ? 'Update Sale' : 'Create Sale')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SalesForm;