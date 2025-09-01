import qs from 'qs';
import { authApi } from './api';
import { generateNextInvoiceNumber, generateNextPONumber, getUser } from './utils';

// Create a new sale or purchase entity
export async function createNewEntity(name) {
    let data = {};
    let nameSinglar = name.endsWith('s') ? name.slice(0, -1) : name;
    let namePlural = name.endsWith('s') ? name : name + 's';
    if (name === 'sales' || name === 'sale') {
        const user = getUser();
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
        const user = getUser();
        data = {
            purchase_no: generateNextPONumber(),
            order_date: new Date().toISOString(),
            total: 0,
            users: {
                connect: [user.id],
                disconnect: [],
            },
        };
    }
    const res = await authApi.post(`/${namePlural}`, { data });

    const rdata = res?.data || {};
    const id = rdata.invoice_no ?? rdata.documentId ?? rdata.id;
    return { data: rdata, id, nameSinglar, namePlural };
}

// Fetch sales and returns for reports
export async function fetchSales() {
    return await authApi.fetch("/sales", { sort: ["id:desc"], pagination: { pageSize: 200 } },);
}

export async function fetchReturns(page, rowsPerPage) {
    return await authApi.fetch("/sale-returns", { pagination: { page, pageSize: rowsPerPage } });
}

// Fetch purchases for reports
export async function fetchPurchases(page, rowsPerPage) {
    return await authApi.fetch("/purchases", { sort: ["id:desc"], pagination: { page, pageSize: rowsPerPage } });
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
            $or: [{ purchase_no: id }, { id }, { documentId: id }]
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



export async function featchSearch(searchTerm, page, rowsPerPage) {
    let queries = [
        {
            entity: 'products',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchTerm } },
                        { barcode: { $eq: searchTerm } },
                        { sku: { $eq: searchTerm } }
                    ]
                },
                populate: ['category', 'brand'],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'purchases',
            query: {
                filters: {
                    $or: [
                        { supplier: { $or: [{ name: { $containsi: searchTerm } }, { phone: { $containsi: searchTerm } }] } },

                        { purchase_no: { $eq: searchTerm } },
                    ]
                },
                populate: ['supplier'],
                pagination: { page, pageSize: rowsPerPage }

            }
        },
        {
            entity: 'sales',
            query: {
                filters: {
                    $or: [
                        { customer: { $or: [{ name: { $containsi: searchTerm } }, { phone: { $containsi: searchTerm } }] } },
                        { invoice_no: { $eq: searchTerm } },
                    ]
                },
                populate: ['customer'],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'stock-items',
            query: {
                filters: {
                    $or: [
                        { barcode: { $eq: searchTerm } },
                        { sku: { $eq: searchTerm } }
                    ]
                },
                populate: ['product'],
                pagination: { page, pageSize: rowsPerPage }
            }
        }
    ];


    let results = [];
    // for (let { name, query } in queries) {
    for (let { entity, query } of queries) {
        
        const res = await authApi.fetch(`/${entity}?` + qs.stringify(query, { encodeValuesOnly: true }));
        console.log('Fetching', entity, query, res.data);
        results.push({ entity, data: res?.data ??[], pagination: res?.meta?.pagination })
    }


    const data = results.map((res, i) => {
        return res.data.map((r) => {
         //   const r = res.data;
            //const total
            return {
                entity: res.entity,
                name: r.name ?? r?.product?.name,
                code: r.purchase_no ?? r.invoice_no,
                barcode: r.barcode,
                sku: r.sku,
                id: r.id,
                documentId: r.documentId,
                date: r.sale_date ?? r.order_date,
                person_name: r.customer?.name ?? r.supplier?.name ?? r.name,
                phone: r.customer?.phone ?? r.supplier?.phone ?? '',
                email: r.customer?.email ?? r.supplier?.email ?? '',
                total: r.total,
                subtotal: r.subtotal,
            }
        })
    }).flat();

    const pagination = results.reduce((pre, curr) => {
        const p = curr.pagination
        pre.total = Math.max(pre.total, p?.total ?? 0);
        return pre;
    }, { total: 0, page, pageSize: rowsPerPage });

    const result = { results, data, pagination, meta: { pagination } };
    console.log(result);

    return result;
}