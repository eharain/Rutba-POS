import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import PermissionCheck from "../components/PermissionCheck";
import { fetchSales } from "../lib/pos";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TablePagination } from "../components/Table";
export default function Sales() {
    const [sales, setSales] = useState([]);
    const { jwt } = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            //const res = await authApi.fetch("/sales", { sort: ["id:desc"], pagination: { pageSize: 100 } });
            const res = await fetchSales(page, rowsPerPage);
            setSales(res.data || []);
            setTotal(res.meta.pagination.total);
            setLoading(false);
        })();
    }, [jwt, page, rowsPerPage]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <ProtectedRoute>
            <PermissionCheck required="api::sale.sale.find">
                <Layout>
                    <div style={{ padding: 24 }}>
                        <h2 style={{ marginBottom: 16 }}>Sales</h2>
                        <div style={{ background: "#fff", borderRadius: 4, boxShadow: "0 2px 8px #eee", overflow: "hidden" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Number</TableCell>
                                        <TableCell>Invoice</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Buyer</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Edit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {sales.length === 0 && <p>No sales yet.</p>}
                                    {sales.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.id}</TableCell>
                                            <TableCell>{s.invoice_no}</TableCell>
                                            <TableCell>{new Date(s.sale_date).toLocaleString()}</TableCell>
                                            <TableCell>{s?.customer?.name}</TableCell>
                                            <TableCell align="right">${s.total}</TableCell>
                                            <TableCell>{s.status}</TableCell>
                                            <TableCell>
                                                <Link href={`/${s.invoice_no}/sale`}>
                                                    Edit
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}

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
                    </div >
                </Layout>
            </PermissionCheck>
        </ProtectedRoute>
    );
}
