import qs from 'qs';
import { authApi } from '../api';
import { generateNextInvoiceNumber, generateNextPONumber, getUser } from '../utils';


function createQueries(searchTerm, page, rowsPerPage) {
    return [
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
                        { suppliers: { $or: [{ name: { $containsi: searchTerm } }, { phone: { $containsi: searchTerm } }] } },

                        { purchase_no: { $eq: searchTerm } },
                    ]
                },
                populate: ['suppliers'],
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
}

// General search function across multiple entities
export async function featchSearch(searchTerm, page, rowsPerPage) {
    let queries = createQueries(searchTerm, page, rowsPerPage);

    let results = [];
    // for (let { name, query } in queries) {
    for (let { entity, query } of queries) {

        const res = await authApi.fetch(`/${entity}?` + qs.stringify(query, { encodeValuesOnly: true }));
        console.log('Fetching', entity, query, res.data);
        results.push({ entity, data: res?.data ?? [], pagination: res?.meta?.pagination })
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
