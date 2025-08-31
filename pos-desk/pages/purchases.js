import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TablePagination } from "../components/Table";
import { fetchPurchases } from "../lib/pos";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
export default function PurchasesPage() {
    const [purchases, setPurchases] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
         loadPurchaseData();


        async function loadPurchaseData() {
            setLoading(true);
            const data = await fetchPurchases(page, rowsPerPage);

            setPurchases(data.data);
            setTotal(data.meta.pagination.total);
            setLoading(false);
        }
      
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div style={{ padding: 24 }}>
                    <h2 style={{ marginBottom: 16 }}>Purchases</h2>
                    <div style={{ background: "#fff", borderRadius: 4, boxShadow: "0 2px 8px #eee", overflow: "hidden" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Purchase Number</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Invoice</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                ) : purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No purchases found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((purchase) => (
                                        <TableRow key={purchase.id}>
                                            <TableCell>{purchase.purchase_no}</TableCell>
                                            <TableCell>{purchase.order_date}</TableCell>
                                            <TableCell>{purchase?.supplier?.name}</TableCell>
                                            <TableCell>{purchase.invoice}</TableCell>
                                            <TableCell align="right">${purchase.total}</TableCell>
                                            <TableCell>{purchase.status}</TableCell>
                                            <TableCell><Link href={'/' + purchase.purchase_no + '/purchase'}> <i className="fas fa-edit"></i> Edit</Link></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            count={total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}