import { useEffect, useState } from 'react';
import { fetchSaleByIdOrInvoice, searchStockItemsByName, searchStockItemsByBarcode, saveSaleItems } from '../../lib/pos';
import { authApi } from '../../lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PermissionCheck from '../../components/PermissionCheck';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';

export default function SalePage({ params }) {
    const router = useRouter();
    const { id } = router.query;

    const [sale, setSale] = useState(null);
    const [barcode, setBarcode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        async function fetchSale() {
            const saleData = await fetchSaleByIdOrInvoice(id);
            console.log('Fetched Sale Data:', saleData);
            setSale(saleData);
        }
        if (id) fetchSale();
      
    }, [id]);



    async function addStockItem(stockItem) {
        const updatedItems = [...(sale.items || []), { stock_item: stockItem, quantity: 1, price: stockItem.price }];
        await saveSaleItems(id, updatedItems);
        setSale({ ...sale, attributes: { ...sale, items: updatedItems } });
        setBarcode('');
    }

    async function searchStockItems() {
        const results = await searchStockItemsByName(searchTerm);
        setSearchResults(results);
    }

    async function handleBarcodeSearch(e) {
        e.preventDefault();
        if (!barcode) return;
        const results = await searchStockItemsByBarcode(barcode);
        if (results.length > 0) {
            addStockItem(results[0]);
        }
    }

    function updateItemField(index, field, value) {
        const updatedItems = sale.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setSale({ ...sale, ... { ...sale, items: updatedItems } });
    }

    async function saveChanges() {
        await saveSaleItems(id, sale.items);
    }

    if (!sale) return <div>Loading...</div>;

    return (
        <Layout>
            <ProtectedRoute>
                <PermissionCheck required='api::sale.sale.find,api::sale-item.sale-item.find,api::stock-item.stock-item.find'>
                    <div>
                        <h1>Sale #{sale.id}</h1>

                        <form onSubmit={handleBarcodeSearch}>
                            <input
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Scan barcode"
                            />
                            <button type="submit">Add</button>
                        </form>

                        <div>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search stock by name"
                            />
                            <button onClick={searchStockItems}>Search</button>
                            <ul>
                                {searchResults.map((s) => (
                                    <li key={s.id}>
                                        {s.name} - {s.barcode}
                                        <button onClick={() => addStockItem(s)}>Add</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <h2>Items</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items && sale.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.stock_item.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItemField(index, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateItemField(index, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button onClick={saveChanges}>Save Changes</button>
                    </div>
                </PermissionCheck>
            </ProtectedRoute>
        </Layout>
    );
}
