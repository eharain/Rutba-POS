// file: /pos-desk/hooks/usePrintBarcodes.js
import { useCallback } from 'react';

const usePrintBarcodes = () => {
    const printBarcodes = useCallback((items, title = "Stock Item Barcodes") => {
        if (!items || items.length === 0) {
            alert("No items to print");
            return;
        }

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Barcodes</title>
                <meta charset="utf-8">
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.printItems = ${JSON.stringify(items)};
                    window.printTitle = ${JSON.stringify(title)};
                </script>
                <script src="/print-barcodes.js"></script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
    }, []);

    return { printBarcodes };
};

export default usePrintBarcodes;