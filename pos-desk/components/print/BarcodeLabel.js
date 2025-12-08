// file: /pos-desk/components/print/BarcodeLabel.js
import React from 'react';
import ProductInfo from './ProductInfo';
import SkuDisplay from './SkuDisplay';
import BarcodeDisplay from './BarcodeDisplay';

const BarcodeLabel = ({ item, isEmpty = false }) => {
    if (isEmpty) {
        return (
            <div className="barcode-label empty">
                <style jsx>{`
                    .barcode-label.empty {
                        border: 1px dashed #ccc;
                        background: #f9f9f9;
                        padding: 8px;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 1.2in;
                        font-size: 10px;
                        page-break-inside: avoid;
                    }
                `}</style>
                <div style={{ color: '#999', fontSize: '8px' }}>EMPTY SLOT</div>
            </div>
        );
    }

    return (
        <div className="barcode-label">
            <style jsx>{`
                .barcode-label {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 1.2in;
                    font-size: 10px;
                    page-break-inside: avoid;
                    background: grey;
                }
                
                @media print {
                    .barcode-label {
                        border: 1px solid #000;
                        background: grey;
                    }
                }
                
                @media screen {
                    .barcode-label {
                        border: 1px solid #ccc;
                    }
                }
            `}</style>

            <ProductInfo
                product={item.product}
                status={item.status}
                costPrice={item.cost_price}
            />

            <SkuDisplay sku={item.sku} />

            <BarcodeDisplay
                barcode={item.barcode}
                sku={item.sku}
            />
        </div>
    );
};

export default BarcodeLabel;