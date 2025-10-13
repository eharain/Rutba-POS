// file: /pos-desk/components/print/BulkPrintPreview.js
import React, { useEffect } from 'react';
import BulkBarcodePrint from './BulkBarcodePrint';

const BulkPrintPreview = ({ storageKey, title, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else if (window.opener) {
            window.close();
        } else {
            window.history.back();
        }
    };

    useEffect(() => {
        // Auto-print when component mounts with longer delay for data loading
        const timer = setTimeout(() => {
            window.print();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <style jsx global>{`
                @media screen {
                    .print-controls {
                        display: flex;
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: white;
                        padding: 15px;
                        border: 2px solid #007bff;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 1000;
                        gap: 10px;
                        align-items: center;
                    }
                }
                
                @media print {
                    .print-controls {
                        display: none !important;
                    }
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    background: #f5f5f5;
                }
            `}</style>

            {/* Print Controls - Only visible on screen */}
            <div className="print-controls no-print">
                <button
                    onClick={handlePrint}
                    style={{
                        padding: '10px 20px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🖨️ Print Now
                </button>
                <button
                    onClick={handleClose}
                    style={{
                        padding: '10px 20px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </div>

            <BulkBarcodePrint storageKey={storageKey} title={title} />
        </div>
    );
};

export default BulkPrintPreview;