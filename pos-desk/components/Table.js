import React from "react";

// Simple Table Components
export function Table({ children }) {
    return <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>;
}
export function TableHead({ children }) {
    return <thead style={{ background: "black" }}>{children}</thead>;
}
export function TableBody({ children }) {
    return <tbody>{children}</tbody>;
}
export function TableRow({ children }) {
    return <tr>{children}</tr>;
}
export function TableCell({ children, align, colSpan ,title}) {
    return (
        <td
            title={title}
            colSpan={colSpan}
            style={{
                border: "1px solid Black",
                color: "black",
                padding: "8px",
                textAlign: align || "left",
            }}
        >
            {children}
        </td>
    );
}
// Simple Pagination Component
export function TablePagination({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange, rowsPerPageOptions }) {
    const totalPages = Math.ceil(count / rowsPerPage);
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px" }}>
            <span>
                Rows per page:{" "}
                <select value={rowsPerPage} onChange={onRowsPerPageChange}>
                    {rowsPerPageOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </span>
            <span>
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, count)} of {count}
            </span>
            <span>
                <button onClick={() => onPageChange(null, Math.max(0, page - 1))} disabled={page === 0}>
                    {"<"}
                </button>
                <button onClick={() => onPageChange(null, Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                    {">"}
                </button>
            </span>
        </div>
    );
}
// Simple Loader
export function CircularProgress({ size }) {
    return (
        <div style={{ display: "inline-block", width: size, height: size }}>
            <svg viewBox="0 0 50 50" style={{ width: size, height: size }}>
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth="5"
                    strokeDasharray="90"
                    strokeDashoffset="60"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="1s"
                        repeatCount="indefinite" />
                </circle>
            </svg>
        </div>
    );
}
