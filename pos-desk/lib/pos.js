import { authApi } from './api';
import { generateNextInvoiceNumber } from './utils';

// Create a new sale entity
export async function createNewEntity(name) {
    let data = {};
    if (name === 'sales') {
        const user = authApi.getUser();
        data = {
            invoice_no: generateNextInvoiceNumber(),
            sale_date: new Date().toISOString(),
            total: 0,
            users: {
                connect: [user.id],
                disconnect: [],
            },
        };
    }
    const res = await authApi.post(`/${name}`, { data });
    return res;
}

// Fetch sales and returns for reports
export async function fetchSales(jwt) {
    return await authApi.fetch("/sales", { pagination: { pageSize: 200 } }, jwt);
}

export async function fetchReturns(jwt) {
    return await authApi.fetch("/sale-returns", { pagination: { pageSize: 200 } }, jwt);
}

// Fetch a sale by id or invoice_no
export async function fetchSaleByIdOrInvoice(id) {
    let res;
    if (id.indexOf('-') === -1) {
        res = await authApi.get(`/sales/${id}?populate[items][populate][0]=stock_items`);

    } else {
        res = await authApi.get(`/sales/?filters[invoice_no]=${id}&populate[items][populate][0]=stock_items`);
    }
    let data = res?.data?.data ?? res?.data;
    return Array.isArray(data) ? data[0] : data;
}

// Search stock items by name
export async function searchStockItemsByName(searchTerm) {
    const res = await authApi.get(`/stock-items?filters[name][$containsi]=${searchTerm}`);
    return res.data.data;
}

// Search stock items by barcode and add to sale
export async function searchStockItemsByBarcode(barcode) {
    const res = await authApi.get(`/stock-items?filters[barcode][$eq]=${barcode}`);
    return res.data.data;
}

// Save changes to sale items
export async function saveSaleItems(id, items) {
    return await authApi.put(`/sales/${id}`, {
        data: {
            items: items.map((i) => ({
                stock_item: i.stock_item.id,
                quantity: i.quantity,
                price: i.price,
            })),
        },
    });
}