// file: /pos-desk/components/print/BarcodeDisplay.js
import React from 'react';

const BarcodeDisplay = ({ barcode, sku, width = '100%', height = '30px' }) => {
    // Use SKU as barcode if barcode is not available
    const displayBarcode = barcode || sku;

    if (!displayBarcode) {
        return (
            <div style={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                border: '1px dashed #ccc',
                borderRadius: '3px',
                fontSize: '8px',
                color: '#666',
                fontFamily: 'Arial, sans-serif'
            }}>
                NO CODE
            </div>
        );
    }

    return (
        <div className="barcode-display" style={{ width, textAlign: 'center' }}>
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+128+Text&display=swap');
                
                .barcode-display {
                    font-family: 'Libre Barcode 128 Text', cursive;
                    font-size: 24px;
                    line-height: 1;
                    transform: scaleY(1.3);
                    margin: 2px 0;
                    letter-spacing: 1px;
                }
                
                .barcode-text {
                    font-family: 'Courier New', monospace;
                    font-size: 7px;
                    color: #333;
                    margin-top: 4px;
                    letter-spacing: 0.8px;
                    background: #f8f9fa;
                    padding: 1px 3px;
                    border-radius: 2px;
                }
                
                @media print {
                    .barcode-display {
                        font-size: 28px;
                        transform: scaleY(1.4);
                    }
                    
                    .barcode-text {
                        background: transparent;
                    }
                }
            `}</style>

            <div className="barcode-value">
                {displayBarcode}
            </div>
            <div className="barcode-text">
                {displayBarcode}
            </div>
        </div>
    );
};

export default BarcodeDisplay;