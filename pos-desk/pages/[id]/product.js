'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input, Select, Checkbox, Button, Form } from '../../components/FormElements';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
// Example usage in a product edit form
export default function EditProduct({ params }) {
    const router = useRouter();
    const { id } = params;

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        cost_price: '',
        selling_price: '',
        tax_rate: '',
        stock_quantity: '',
        reorder_level: '',
        is_active: true,
        category: '',
        brand: ''
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories and brands
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/brands')
                ]);

                const categoriesData = await categoriesResponse.json();
                const brandsData = await brandsResponse.json();

                setCategories(categoriesData);
                setBrands(brandsData);

                // If editing existing product, fetch product data
                if (id && id !== 'new') {
                    const productResponse = await fetch(`/api/products/${id}`);
                    const productData = await productResponse.json();

                    setFormData({
                        name: productData.name || '',
                        sku: productData.sku || '',
                        barcode: productData.barcode || '',
                        cost_price: productData.cost_price || '',
                        selling_price: productData.selling_price || '',
                        tax_rate: productData.tax_rate || '',
                        stock_quantity: productData.stock_quantity || '',
                        reorder_level: productData.reorder_level || '',
                        is_active: productData.is_active !== undefined ? productData.is_active : true,
                        category: productData.category?.id || '',
                        brand: productData.brand?.id || ''
                    });
                }
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const url = id && id !== 'new' ? `/api/products/${id}` : '/api/products';
            const method = id && id !== 'new' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/products');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save product');
            }
        } catch (err) {
            setError('An error occurred while saving the product');
            console.error('Error saving product:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <p>Loading...</p>
                </div>
                    </div>
                </Layout>
			</ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">
                {id && id !== 'new' ? 'Edit Product' : 'Create New Product'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Product Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required={true}
                        placeholder="Product Name"
                    />

                    <Input
                        label="SKU"
                        name="sku"
                        type="text"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="SKU"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Barcode"
                        name="barcode"
                        type="text"
                        value={formData.barcode}
                        onChange={handleChange}
                        placeholder="Barcode"
                    />

                    <Input
                        label="Selling Price"
                        name="selling_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.selling_price}
                        onChange={handleChange}
                        required={true}
                        placeholder="0.00"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Cost Price"
                        name="cost_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost_price}
                        onChange={handleChange}
                        placeholder="0.00"
                    />

                    <Input
                        label="Tax Rate (%)"
                        name="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.tax_rate}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Stock Quantity"
                        name="stock_quantity"
                        type="number"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="0"
                    />

                    <Input
                        label="Reorder Level"
                        name="reorder_level"
                        type="number"
                        min="0"
                        value={formData.reorder_level}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    />

                    <Select
                        label="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
                    />
                </div>

                <Checkbox
                    label="Product is active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                />

                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : (id && id !== 'new' ? 'Update Product' : 'Create Product')}
                    </Button>
                </div>
            </Form>
                </div>
            </Layout>
		</ProtectedRoute>
    );
}