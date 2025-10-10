// file: /pos-desk/components/PrintBarcodeLabels.js
import React from 'react';

const PrintBarcodeLabels = ({ items, title = "Stock Item Barcodes" }) => {
    return (
        <div className="barcode-print-page">
            <style jsx>{`
                .barcode-print-page {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                .barcode-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .barcode-label {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: center;
                    page-break-inside: avoid;
                    min-height: 80px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .product-name {
                    font-weight: bold;
                    font-size: 12px;
                    margin-bottom: 5px;
                    line-height: 1.2;
                }
                .barcode-number {
                    font-size: 10px;
                    margin: 5px 0;
                    font-family: 'Courier New', monospace;
                    background: #f5f5f5;
                    padding: 2px 4px;
                    border-radius: 2px;
                }
                .sku {
                    font-size: 10px;
                    color: #666;
                    margin-bottom: 3px;
                }
                .status {
                    font-size: 9px;
                    color: #888;
                }
                .print-header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                @media print {
                    .barcode-container {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .barcode-label {
                        border: 1px solid #000;
                    }
                    .print-header {
                        display: block;
                    }
                }
                @media screen {
                    .print-header {
                        display: none;
                    }
                }
            `}</style>

            {/* This header only shows when printed */}
            <div className="print-header">
                <h2>{title}</h2>
                <p>Printed on: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="barcode-container">
                {items.map((item, index) => (
                    <div key={index} className="barcode-label">
                        <div className="product-name">
                            {item.product?.name || 'N/A'}
                        </div>
                        <div className="sku">
                            SKU: {item.sku || 'N/A'}
                        </div>
                        <div className="barcode-number">
                            {item.barcode || 'No Barcode'}
                        </div>
                        <div className="status">
                            Status: {item.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrintBarcodeLabels;