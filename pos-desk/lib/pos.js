import { authApi } from './api';
import { generateNextInvoiceNumber } from './utils';

// Create a new sale or purchase entity
export async function createNewEntity(name) {
    let data = {};
    if (name === 'sales' || name === 'sale') {
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
    } else if (name === 'purchases' || name === 'purchase') {
        const user = authApi.getUser();
        data = {
            invoice_no: generateNextInvoiceNumber(),
            purchase_date: new Date().toISOString(),
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
export async function fetchSales() {
    return await authApi.fetch("/sales", { sort: ["id:desc"], pagination: { pageSize: 200 } },);
}

export async function fetchReturns() {
    return await authApi.fetch("/sale-returns", { pagination: { pageSize: 200 } });
}

// Fetch purchases for reports
export async function fetchPurchases() {
    return await authApi.fetch("/purchases", { sort: ["id:desc"], pagination: { pageSize: 200 } });
}

// Fetch a sale or purchase by id or invoice_no
export async function fetchSaleByIdOrInvoice(id) {
    let res;
    res = await authApi.get("/sales/", {
        filters: {
            $or: [{ invoice_no: id }, { id }, { documentId: id }]
        },
        populate: { items: { populate: ["stock_items"] } }
    });
    let data = res?.data?.data ?? res?.data;
    return Array.isArray(data) ? data[0] : data;
}

export async function fetchPurchaseByIdOrInvoice(id) {
    let res;
    res = await authApi.get("/purchases/", {
        filters: {
            $or: [{ invoice_no: id }, { id }, { documentId: id }]
        },
        populate: { items: { populate: ["stock_items"] } }
    });
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

// Save changes to purchase items
export async function savePurchaseItems(id, items) {
    return await authApi.put(`/purchases/${id}`, {
        data: {
            items: items.map((i) => ({
                stock_item: i.stock_item.id,
                quantity: i.quantity,
                price: i.price,
            })),
        },
    });
}