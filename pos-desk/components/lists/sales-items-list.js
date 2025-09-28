import { Table, TableHead, TableBody, TableRow, TableCell } from '../Table';

export default function SalesItemsList({ items, onUpdateItem, onRemoveItem }) {
    const handleQuantityChange = (index, quantity) => {
        const item = items[index];
        const newQuantity = Math.max(1, quantity);
        const newTotal = item.price * newQuantity;

        onUpdateItem(index, {
            quantity: newQuantity,
            total: newTotal
        });
    };

    const handlePriceChange = (index, price) => {
        const item = items[index];
        const newPrice = Math.max(0, price);
        const newTotal = newPrice * item.quantity;

        onUpdateItem(index, {
            price: newPrice,
            total: newTotal
        });
    };

    const handleQuantityQuickUpdate = (index, change) => {
        const item = items[index];
        const newQuantity = Math.max(1, item.quantity + change);
        const newTotal = item.price * newQuantity;

        onUpdateItem(index, {
            quantity: newQuantity,
            total: newTotal
        });
    };

    return (
        <div>
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
                                {item.product?.bundle_units > 1 && (
                                    <div style={{ fontSize: '11px', color: '#888' }}>
                                        Bundle: {item.product.bundle_units}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => handleQuantityQuickUpdate(index, -1)}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                        style={{
                                            width: '60px',
                                            padding: '6px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleQuantityQuickUpdate(index, 1)}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
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
                                        padding: '6px',
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
                                    onClick={() => onRemoveItem(index)}
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
        </div>
    );
}