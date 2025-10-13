// file: /pos-desk/components/print/LabelSheet.js
import React from 'react';
import BarcodeLabel from './BarcodeLabel';

const LabelSheet = ({ items, sheetIndex, totalSheets, title, totalItems }) => {
    const labelsPerSheet = 30;
    const emptySlots = Math.max(0, labelsPerSheet - items.length);

    return (
        <div className="label-sheet">
            <style jsx>{`
                .label-sheet {
                    page-break-after: always;
                    padding: 0.5in;
                    height: 11in;
                    display: flex;
                    flex-direction: column;
                }
                
                .sheet-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #333;
                }
                
                .labels-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(10, 1fr);
                    gap: 0.2in;
                    flex: 1;
                }
                
                @media print {
                    @page {
                        margin: 0.5in;
                        size: letter portrait;
                    }
                    
                    .label-sheet {
                        margin: 0;
                        padding: 0.5in;
                        height: auto;
                        min-height: 10.5in;
                    }
                    
                    .labels-grid {
                        grid-template-columns: repeat(3, 1fr);
                        grid-template-rows: repeat(10, 1fr);
                        gap: 0.15in;
                    }
                }
                
                @media screen {
                    .label-sheet {
                        border: 1px solid #ccc;
                        margin-bottom: 20px;
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                }
            `}</style>

            <div className="sheet-header">
                <h2>{title} - Sheet {sheetIndex + 1} of {totalSheets}</h2>
                <p>Total Items: {totalItems} | Printed: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="labels-grid">
                {items.map((item, index) => (
                    <BarcodeLabel
                        key={item.documentId || item.id || index}
                        item={item}
                    />
                ))}

                {/* Fill empty slots to maintain grid layout */}
                {Array.from({ length: emptySlots }).map((_, index) => (
                    <BarcodeLabel
                        key={`empty-${index}`}
                        isEmpty={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default LabelSheet;