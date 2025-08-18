import { useEffect, useState } from 'react';
import { api,  authApi } from '../../lib/api';
import { useRouter } from 'next/router';
export default function SalePage({ params }) {
    //const { id } = params; // sale id from URL
    const router = useRouter();
    const { id } = router.query; // Access the dynamic 'id' parameter

    if (id == 'new') {
        return <div>New Sale</div>; // Handle new sale creation here
    }
    const [sale, setSale] = useState(null);
    const [barcode, setBarcode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        async function fetchSale() {
            const res = await authApi.get(`/sales/${id}?populate=items.stock_item`);
            setSale(res.data.data);
        }
        fetchSale();
    }, [id]);

    async function addStockItem(stockItem) {
        const updatedItems = [...(sale.attributes.items || []), { stock_item: stockItem, quantity: 1, price: stockItem.price }];
        await authApi.put(`/sales/${id}`, {
            data: {
                items: updatedItems.map((i) => ({
                    stock_item: i.stock_item.id,
                    quantity: i.quantity,
                    price: i.price,
                })),
            },
        });
        setSale({ ...sale, attributes: { ...sale.attributes, items: updatedItems } });
        setBarcode('');
    }

    async function searchStockItems() {
        const res = await authApi.get(`/stock-items?filters[name][$containsi]=${searchTerm}`);
        setSearchResults(res.data.data);
    }

    async function handleBarcodeSearch(e) {
        e.preventDefault();
        if (!barcode) return;
        const res = await authApi.get(`/stock-items?filters[barcode][$eq]=${barcode}`);
        if (res.data.data.length > 0) {
            addStockItem(res.data.data[0]);
        }
    }

    function updateItemField(index, field, value) {
        const updatedItems = sale.attributes.items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setSale({ ...sale, attributes: { ...sale.attributes, items: updatedItems } });
    }

    async function saveChanges() {
        await apiAuth.put(`/sales/${id}`, {
            data: {
                items: sale.attributes.items.map((i) => ({
                    stock_item: i.stock_item.id,
                    quantity: i.quantity,
                    price: i.price,
                })),
            },
        });
    }

    if (!sale) return <div>Loading...</div>;

    return (
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
                            {s.attributes.name} - {s.attributes.barcode}
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
                    {sale.attributes.items && sale.attributes.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.stock_item.attributes.name}</td>
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
    );
}
