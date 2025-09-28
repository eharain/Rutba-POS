import { Table, TableHead, TableBody, TableRow, TableCell } from '../Table';

export default function SalesItemsList({ items, onUpdateItem, onRemoveItem }) {
    const calculateItemDetails = (item) => {
        const subtotal = item.price * item.quantity;
        const discountAmount = subtotal * ((item.discount || 0) / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * 0.1; // 10% tax
        const total = taxableAmount + taxAmount;

        return {
            subtotal,
            discountAmount,
            taxableAmount,
            taxAmount,
            total
        };
    };

    const handleQuantityChange = (index, quantity) => {
        const newQuantity = Math.max(1, quantity);
        onUpdateItem(index, {
            quantity: newQuantity
        });
    };

    const handlePriceChange = (index, price) => {
        const newPrice = Math.max(0, price);
        onUpdateItem(index, {
            price: newPrice
        });
    };

    const handleDiscountChange = (index, discount) => {
        const newDiscount = Math.max(0, Math.min(100, discount)); // Limit between 0-100%
        onUpdateItem(index, {
            discount: newDiscount
        });
    };

    const handleQuantityQuickUpdate = (index, change) => {
        const item = items[index];
        const newQuantity = Math.max(1, item.quantity + change);
        onUpdateItem(index, {
            quantity: newQuantity
        });
    };

    const handleDiscountQuickUpdate = (index, change) => {
        const item = items[index];
        const newDiscount = Math.max(0, Math.min(100, (item.discount || 0) + change));
        onUpdateItem(index, {
            discount: newDiscount
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
                        <TableCell align="center">Discount %</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => {
                        const details = calculateItemDetails(item);

                        return (
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

                                {/* Quantity Column */}
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

                                {/* Price Column */}
                                <TableCell align="center">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                                        style={{
                                            width: '80px',
                                            padding: '6px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '14px'
                                        }}
                                    />
                                </TableCell>

                                {/* Discount Column */}
                                <TableCell align="center">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => handleDiscountQuickUpdate(index, -5)}
                                            style={{
                                                padding: '4px 8px',
                                                background: '#6c757d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            -5%
                                        </button>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={item.discount || 0}
                                            onChange={(e) => handleDiscountChange(index, parseFloat(e.target.value) || 0)}
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
                                            onClick={() => handleDiscountQuickUpdate(index, 5)}
                                            style={{
                                                padding: '4px 8px',
                                                background: '#6c757d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            +5%
                                        </button>
                                    </div>
                                    {item.discount > 0 && (
                                        <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px' }}>
                                            Save: ${details.discountAmount.toFixed(2)}
                                        </div>
                                    )}
                                </TableCell>

                                {/* Total Column */}
                                <TableCell align="center">
                                    <div>
                                        <strong>${details.total.toFixed(2)}</strong>
                                        {item.discount > 0 && (
                                            <div style={{ fontSize: '11px', color: '#666', textDecoration: 'line-through' }}>
                                                ${details.subtotal.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Actions Column */}
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
                        );
                    })}
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