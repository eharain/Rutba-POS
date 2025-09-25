// components/lists/purchase-items-list.js
import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../Table';
import PurchaseItemForm from '../form/purchase-item-form';

const PurchaseItemsList = ({ purchaseItems, onEditItem, onDeleteItem, onSaveItem, onCancelEdit, editingItemId }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Unit Price</TableCell>
                    <TableCell align="center">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {purchaseItems.map((item) => (
                    <React.Fragment key={item.id}>
                        {editingItemId === item.id ? (

                            <PurchaseItemForm
                                purchaseItem={item}
                                onSubmit={onSaveItem}
                                onCancel={onCancelEdit}
                            />

                        ) : (
                            <TableRow>
                                <TableCell>
                                    <strong>{item.product?.name || "N/A"}</strong>
                                    {item.product?.barcode && (
                                        <span style={{ color: '#666', marginLeft: '8px' }}>
                                            ({item.product.barcode})
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <strong>{item.quantity}</strong>
                                    {item?.product?.bundle_size > 1 && (<span style={{ color: '#666', marginLeft: '8px' }}>
                                        bundle of  {item?.product?.bundle_size}
                                    </span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    ${item.unitPrice?.toFixed(2) || item.price?.toFixed(2) || "0.00"}
                                </TableCell>
                                <TableCell align="center">
                                    <strong>
                                        ${((item.quantity || 0) * (item.unitPrice || item.price || 0)).toFixed(2)}
                                    </strong>
                                </TableCell>
                                <TableCell align="center">
                                    <button
                                        onClick={() => onEditItem(item.id)}
                                        style={{
                                            padding: '4px 12px',
                                            background: 'transparent',
                                            color: '#007bff',
                                            border: '1px solid #007bff',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '8px'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDeleteItem(item.id)}
                                        style={{
                                            padding: '4px 12px',
                                            background: 'transparent',
                                            color: '#dc3545',
                                            border: '1px solid #dc3545',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    );
};

export default PurchaseItemsList;