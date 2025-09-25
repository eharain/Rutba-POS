import qs from 'qs';

export const buildQueries = (searchText, page = 1, rowsPerPage = 5) => {

    const queries =
    {
        products: {
            search_filters: {
                $or: [
                    { name: { $containsi: searchText } },
                    { barcode: { $eq: searchText } },
                    { sku: { $eq: searchText } },
                    { suppliers: { $or: [{ name: { $containsi: searchText } }, { phone: { $containsi: searchText } }] } },
                ]
            },
            query: {
                populate: [
                    'categories',
                    'brands',
                    'suppliers',
                    'logo',
                    'gallery',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },

        purchases: {
            search_filters: {
                $or: [
                    { suppliers: { $or: [{ name: { $containsi: searchText } }, { phone: { $containsi: searchText } }] } },
                    { purchase_no: { $eq: searchText } },
                ]
            },
            query: {

                populate: [
                    'suppliers',
                    'logo',
                    'gallery',
                    { 'items': { populate: ['product'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        sales: {
            search_filters: {
                $or: [
                    { customer: { $or: [{ name: { $containsi: searchText } }, { phone: { $containsi: searchText } }] } },
                    { invoice_no: { $eq: searchText } },
                ]
            },
            query: {
                populate: [
                    'customer',
                    'logo',
                    'gallery',
                    { 'items': { populate: ['product'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        'stock-items': {
            search_filters: {
                $or: [
                    { barcode: { $eq: searchText } },
                    { sku: { $eq: searchText } }
                ]
            },
            query: {

                populate: [
                    'product',
                    'logo',
                    'gallery'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        branches: {
            search_filters: {
                $or: [
                    { name: { $containsi: searchText } },
                    { code: { $eq: searchText } }
                ]
            },
            query: {

                populate: [
                    'logo',
                    'gallery',
                    { categories: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        categories: {
            search_filters: {
                $or: [
                    { name: { $containsi: searchText } },
                    { code: { $eq: searchText } }
                ]
            },
            query: {

                populate: [
                    'logo',
                    'gallery',
                    { parent: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        term_types: {
            search_filters: {
                $or: [
                    { name: { $containsi: searchText } },
                    { code: { $eq: searchText } }
                ]
            },
            query: {

                populate: [
                    'logo',
                    'gallery',
                    { terms: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        terms: {
            search_filters: {
                $or: [
                    { name: { $containsi: searchText } },
                    { code: { $eq: searchText } }
                ]
            },
            query: {

                populate: [
                    'logo',
                    'gallery',
                    { term_type: { populate: ['logo', 'gallery'] } }
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        }
    }
    Object.entries(queries).forEach(([entity, q]) => {
        if (!searchText || searchText.trim().length === 0) {
            delete q.search_filters;
        } else {
            q.query.filters = q.search_filters;
        }
        q.entity = entity;
        q.url = QueryUrl(q);
    });
    return queries;
}

export function QueryUrl(q) {
    return `/${q.entity}?` + qs.stringify(q.query, { encodeValuesOnly: true });
}


export function buildItemQuery(entity, page = 1, rowsPerPage = 5) {
    const queries = {

        "purchase-items": {

            query: {
                populate: [
                    'product',
                    'purchase',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },

        "sale-return-items": {
            query: {
                populate: [
                    'product',
                    'sale',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        "purchase-return-items": {
            query: {
                populate: [
                    'product',
                    'purchase',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        'sale-items': {
            query: {
                populate: [
                    'product',
                    'sale',
                    'items'
                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        },
        "stock-item": {
            query: {
                populate: [
                    'product',
                    'purchase_item',
                    'sale_item',
                    'purchase_return_item',
                    'sale_return_item',

                ],
                pagination: { page, pageSize: rowsPerPage }
            }
        }
    }


    Object.entries(queries).forEach(([entity, q]) => {
        if (!searchText || searchText.trim().length === 0) {
            delete q.search_filters;
        } else {
            q.query.filters = q.search_filters;
        }
        q.entity = entity;
        q.url = QueryUrl(q);
    });
    return queries;


}