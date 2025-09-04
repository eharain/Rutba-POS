import qs from 'qs';
import { authApi } from '../api';

function createQueries(searchText, page, rowsPerPage) {
    // Helper to build filters only if searchText is present
    const hasSearch = !!searchText && searchText.trim().length > 0;

    const queries = [
        {
            entity: 'products',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchText } },
                        { barcode: { $eq: searchText } },
                        { sku: { $eq: searchText } }
                    ]
                },
                populate: [
                    'category',
                    'brand',
                    'logo',
                    'gallery'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'purchases',
            query: {
                filters: {
                    $or: [
                        { suppliers: { $or: [{ name: { $containsi: searchText } }, { phone: { $containsi: searchText } }] } },
                        { purchase_no: { $eq: searchText } },
                    ]
                },
                populate: [
                    'suppliers',
                    'logo',
                    'gallery'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'sales',
            query: {
                filters: {
                    $or: [
                        { customer: { $or: [{ name: { $containsi: searchText } }, { phone: { $containsi: searchText } }] } },
                        { invoice_no: { $eq: searchText } },
                    ]
                },
                populate: [
                    'customer',
                    'logo',
                    'gallery',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'stock-items',
            query: {
                filters: {
                    $or: [
                        { barcode: { $eq: searchText } },
                        { sku: { $eq: searchText } }
                    ]
                },
                populate: [
                    'product',
                    'logo',
                    'gallery'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'branches',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchText } },
                        { code: { $eq: searchText } }
                    ]
                },
                populate: [
                    'logo',
                    'gallery',
                    { categories: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'categories',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchText } },
                        { code: { $eq: searchText } }
                    ]
                },
                populate: [
                    'logo',
                    'gallery',
                    { parent: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'term_types',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchText } },
                        { code: { $eq: searchText } }
                    ]
                },
                populate: [
                    'logo',
                    'gallery',
                    { terms: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        {
            entity: 'terms',
            query: {
                filters: {
                    $or: [
                        { name: { $containsi: searchText } },
                        { code: { $eq: searchText } }
                    ]
                },
                populate: [
                    'logo',
                    'gallery',
                    { term_type: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        }
    ];

    if (!hasSearch) {
        queries.forEach(q => {
            delete q.query.filters;
        })
    }

    return queries;
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
