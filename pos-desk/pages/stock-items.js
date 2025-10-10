// file: /pos-desk/pages/stock-items.js
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    TablePagination,
} from "../components/Table";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { authApi } from "../lib/api";
import { stock_status } from "../lib/api";

export default function StockItemsPage() {
    const [stockItems, setStockItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [statusFilter, setStatusFilter] = useState("Received");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadStockItems();
    }, [page, rowsPerPage, statusFilter]);

    useEffect(() => {
        const filtered = stockItems.filter(item =>
            item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [stockItems, searchTerm]);

    const loadStockItems = async () => {
        setLoading(true);
        try {
            const response = await authApi.get("/stock-items", {
                populate: ["product", "purchase_item"],
                filters: {
                    status: statusFilter
                },
                pagination: {
                    page: page + 1,
                    pageSize: rowsPerPage
                },
                sort: ["createdAt:desc"]
            });

            const data = response.data || [];
            setStockItems(data);
            setFilteredItems(data);
            setTotal(response.meta?.pagination?.total || 0);
        } catch (error) {
            console.error("Error loading stock items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map(item => item.documentId || item.id)));
        }
    };

    const handlePrintSelected = () => {
        if (selectedItems.size === 0) {
            alert("Please select items to print");
            return;
        }

        const itemsToPrint = filteredItems.filter(item =>
            selectedItems.has(item.documentId || item.id)
        );

        // Open print page in new tab
        const itemsParam = encodeURIComponent(JSON.stringify(itemsToPrint));
        const title = `Stock Items Barcodes (${itemsToPrint.length} items)`;
        const titleParam = encodeURIComponent(title);

        window.open(`/print-barcodes?items=${itemsParam}&title=${titleParam}`, '_blank');
    };

    const handlePrintAllFiltered = () => {
        if (filteredItems.length === 0) {
            alert("No items to print");
            return;
        }

        const itemsParam = encodeURIComponent(JSON.stringify(filteredItems));
        const title = `${statusFilter} Stock Items (${filteredItems.length} items)`;
        const titleParam = encodeURIComponent(title);

        window.open(`/print-barcodes?items=${itemsParam}&title=${titleParam}`, '_blank');
    };

    const handlePrintSingle = (item) => {
        const itemsParam = encodeURIComponent(JSON.stringify([item]));
        const title = `Barcode - ${item.sku || item.product?.name || 'Item'}`;
        const titleParam = encodeURIComponent(title);

        window.open(`/print-barcodes?items=${itemsParam}&title=${titleParam}`, '_blank');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Received": return "#28a745";
            case "InStock": return "#17a2b8";
            case "Sold": return "#6c757d";
            case "Reserved": return "#ffc107";
            case "Damaged": return "#dc3545";
            default: return "#6c757d";
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: '20px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Stock Items</h2>

                    {/* Filters and Actions */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto auto',
                        gap: '15px',
                        marginBottom: '20px',
                        alignItems: 'end'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Status Filter:
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            >
                                {stock_status.statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Search:
                            </label>
                            <input
                                type="text"
                                placeholder="Search by SKU, barcode, or product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>

                        <button
                            onClick={handlePrintSelected}
                            disabled={selectedItems.size === 0}
                            style={{
                                padding: '8px 16px',
                                background: selectedItems.size > 0 ? '#007bff' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: selectedItems.size > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Print Selected ({selectedItems.size})
                        </button>

                        <button
                            onClick={handlePrintAllFiltered}
                            disabled={filteredItems.length === 0}
                            style={{
                                padding: '8px 16px',
                                background: filteredItems.length > 0 ? '#28a745' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: filteredItems.length > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Print All Filtered
                        </button>
                    </div>

                    {/* Stock Items Table */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '50px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Barcode</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Cost Price</TableCell>
                                <TableCell>Selling Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No stock items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((item) => {
                                    const itemId = item.documentId || item.id;
                                    const isSelected = selectedItems.has(itemId);

                                    return (
                                        <TableRow key={itemId}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectItem(itemId)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <strong>{item.sku || 'N/A'}</strong>
                                            </TableCell>
                                            <TableCell>
                                                {item.barcode ? (
                                                    <code style={{
                                                        background: '#f8f9fa',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontFamily: 'monospace'
                                                    }}>
                                                        {item.barcode}
                                                    </code>
                                                ) : (
                                                    'No Barcode'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.product?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                ${parseFloat(item.cost_price || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                ${parseFloat(item.selling_price || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: getStatusColor(item.status),
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handlePrintSingle(item)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        background: 'transparent',
                                                        color: '#007bff',
                                                        border: '1px solid #007bff',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Print
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                    />
                </div>
            </Layout>
        </ProtectedRoute>
    );
}