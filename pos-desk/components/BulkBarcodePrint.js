// file: /pos-desk/components/BulkBarcodePrint.js
import React, { useEffect, useState } from 'react';
import { authApi } from '../lib/api';

const BulkBarcodePrint = ({ storageKey, title = "Bulk Barcode Labels" }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadItems = async () => {
            if (!storageKey) {
                setError('No storage key provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Get document IDs from storage
                const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
                const documentIds = storedData.documentIds || [];

                if (documentIds.length === 0) {
                    setError('No items found to print');
                    setLoading(false);
                    return;
                }

                console.log(`Loading ${documentIds.length} items for printing...`);

                // Load items in batches to avoid overwhelming the API
                const batchSize = 20;
                const itemsData = [];

                for (let i = 0; i < documentIds.length; i += batchSize) {
                    const batch = documentIds.slice(i, i + batchSize);
                    const batchPromises = batch.map(async (docId) => {
                        try {
                            const response = await authApi.get(`/stock-items/${docId}`, {
                                populate: ['product']
                            });
                            return response.data;
                        } catch (error) {
                            console.error(`Error loading item ${docId}:`, error);
                            return null;
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    itemsData.push(...batchResults.filter(item => item !== null));

                    // Small delay between batches to avoid rate limiting
                    if (i + batchSize < documentIds.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                setItems(itemsData);

                // Clean up storage after successful load
                localStorage.removeItem(storageKey);

            } catch (error) {
                console.error('Error loading items for print:', error);
                setError('Failed to load items for printing');
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, [storageKey]);

    // Group items for better print layout
    const generateLabelSheets = () => {
        if (loading || items.length === 0) return [];

        const labelsPerSheet = 30;
        const sheets = [];

        for (let i = 0; i < items.length; i += labelsPerSheet) {
            sheets.push(items.slice(i, i + labelsPerSheet));
        }

        return sheets;
    };

    const sheets = generateLabelSheets();

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                fontSize: '16px',
                color: '#dc3545',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <div>❌ {error}</div>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '8px 16px',
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
        );
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                fontSize: '16px',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <div>🔄 Loading items for printing...</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    Loading {items.length > 0 ? `${items.length} items` : 'items'}...
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                fontSize: '16px',
                color: '#666'
            }}>
                No items found to print.
            </div>
        );
    }

    return (
        <div className="bulk-barcode-print">
            <style jsx>{`
                .bulk-barcode-print {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                
                .print-sheet {
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
                }
                
                .product-name {
                    font-weight: bold;
                    font-size: 9px;
                    margin-bottom: 3px;
                    line-height: 1.1;
                    max-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .barcode-number {
                    font-family: 'Courier New', monospace;
                    font-size: 8px;
                    margin: 3px 0;
                    background: #f5f5f5;
                    padding: 2px 4px;
                    border-radius: 2px;
                    letter-spacing: 0.5px;
                }
                
                .sku {
                    font-size: 7px;
                    color: #666;
                    margin-bottom: 2px;
                }
                
                .status {
                    font-size: 6px;
                    color: #888;
                    text-transform: uppercase;
                }
                
                .label-footer {
                    margin-top: 2px;
                    font-size: 6px;
                    color: #999;
                }
                
                /* Print-specific styles */
                @media print {
                    @page {
                        margin: 0.5in;
                        size: letter portrait;
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .bulk-barcode-print {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .print-sheet {
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
                    
                    .barcode-label {
                        border: 1px solid #000;
                        background: white;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                }
                
                /* Screen preview styles */
                @media screen {
                    .bulk-barcode-print {
                        background: white;
                        padding: 20px;
                    }
                    
                    .print-sheet {
                        border: 1px solid #ccc;
                        margin-bottom: 20px;
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                }
            `}</style>

            {sheets.map((sheet, sheetIndex) => (
                <div key={sheetIndex} className="print-sheet">
                    <div className="sheet-header">
                        <h2>{title} - Sheet {sheetIndex + 1} of {sheets.length}</h2>
                        <p>Total Items: {items.length} | Printed: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="labels-grid">
                        {sheet.map((item, index) => (
                            <div key={item.documentId || item.id || index} className="barcode-label">
                                <div className="product-name">
                                    {item.product?.name || 'N/A'}
                                </div>
                                <div className="sku">
                                    SKU: {item.sku || 'N/A'}
                                </div>
                                <div className="barcode-number">
                                    {item.barcode || 'NO BARCODE'}
                                </div>
                                <div className="status">
                                    {item.status}
                                </div>
                                <div className="label-footer">
                                    {item.cost_price ? `Cost: $${parseFloat(item.cost_price).toFixed(2)}` : ''}
                                </div>
                            </div>
                        ))}

                        {/* Fill empty slots to maintain grid layout */}
                        {Array.from({ length: 30 - sheet.length }).map((_, index) => (
                            <div key={`empty-${index}`} className="barcode-label" style={{ border: '1px dashed #ccc', background: '#f9f9f9' }}>
                                <div style={{ color: '#999', fontSize: '8px' }}>EMPTY SLOT</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BulkBarcodePrint;