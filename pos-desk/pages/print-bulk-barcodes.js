// file: /pos-desk/pages/print-bulk-barcodes.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BulkPrintPreview from '../components/BulkPrintPreview';

const PrintBulkBarcodesPage = () => {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('Bulk Barcode Labels');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrintData = () => {
            try {
                // Try to get data from URL parameters first
                const urlParams = new URLSearchParams(window.location.search);
                const itemsParam = urlParams.get('items');
                const titleParam = urlParams.get('title');

                if (itemsParam) {
                    const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
                    setItems(parsedItems);
                    setTitle(titleParam ? decodeURIComponent(titleParam) : 'Bulk Barcode Labels');
                } else {
                    // Fallback to localStorage
                    const storedData = localStorage.getItem('bulkBarcodePrintData');
                    if (storedData) {
                        const { items: storedItems, title: storedTitle } = JSON.parse(storedData);
                        setItems(storedItems || []);
                        setTitle(storedTitle || 'Bulk Barcode Labels');
                        localStorage.removeItem('bulkBarcodePrintData'); // Clean up
                    }
                }
            } catch (error) {
                console.error('Error loading print data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPrintData();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading print data...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h2>No items to print</h2>
                <p>Please go back and select some items to print.</p>
                <button
                    onClick={() => window.close()}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    Close Window
                </button>
            </div>
        );
    }

    return <BulkPrintPreview items={items} title={title} />;
};

export default PrintBulkBarcodesPage;