// file: /pos-desk/pages/print-barcodes.js


import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BarcodePrintPreview from '../components/print/BarcodePrintPreview';

const PrintBarcodesPage = () => {
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('Stock Item Barcodes');

    useEffect(() => {
        // Get items from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const itemsParam = urlParams.get('items');

        if (itemsParam) {
            try {
                const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
                setItems(parsedItems);
            } catch (error) {
                console.error('Error parsing items:', error);
            }
        } else if (window.printItems) {
            // Fallback to window object (for popup usage)
            setItems(window.printItems || []);
            setTitle(window.printTitle || 'Stock Item Barcodes');
        } else {
            // Try localStorage as last resort
            const storedItems = localStorage.getItem('printBarcodeItems');
            if (storedItems) {
                try {
                    const parsedItems = JSON.parse(storedItems);
                    setItems(parsedItems);
                    localStorage.removeItem('printBarcodeItems'); // Clean up
                } catch (error) {
                    console.error('Error parsing stored items:', error);
                }
            }
        }
    }, []);

    if (items.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>No items to print</h2>
                <button onClick={() => window.close()}>Close</button>
            </div>
        );
    }

    return <BarcodePrintPreview items={items} title={title} />;
};

export default PrintBarcodesPage;