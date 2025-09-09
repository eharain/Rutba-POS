'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Input, Select, Checkbox, Button, Form } from '../../components/FormElements';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { authApi } from '../../lib/api';
import { saveProduct, loadProduct } from '../../lib/pos';
// Example usage in a product edit form
export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;

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
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories and brands
                const [categoriesData, brandsData] = await Promise.all([
                    authApi.fetch('/categories').data || [],
                    authApi.fetch('/brands').data || [],
                    authApi.fetch('/branches').data || []
                ]);


                setCategories(categoriesData);
                setBrands(brandsData);

                console.log('Categories:', categoriesData);


                // If editing existing product, fetch product data
                if (id && id !== 'new') {
                    let data = loadProduct(id);
                    setFormData(data);
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
            const response = await saveProduct(id, formData);

            if (response.data.id > 0) {
                router.push('/products');
            } else {
                const errorData = await response.message;
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
                        <div className="grid grid-cols-1 md:grid-cols-2 pl-10 gap-4 mb-4">
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

