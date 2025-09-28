import qs from 'qs';
import { authApi } from '../api';
import { urlAndRelations } from './queries';
import { dataNode } from './search';

// Fetch sales and returns for reports
export async function fetchEntities(entities, page, rowsPerPage = 100) {
    return await authApi.fetch("/" + entities, {
        sort: ["id:desc"], populate: ['logo'], pagination: { page, pageSize: rowsPerPage }
    },);
}
export async function fetchSales(page, rowsPerPage = 200) {
    return await authApi.fetch("/sales", { sort: ['createdAt:desc'], pagination: { page, pageSize: rowsPerPage } },);
}

export async function fetchReturns(page, rowsPerPage = 100) {
    return await authApi.fetch("/sale-returns", { pagination: { page, pageSize: rowsPerPage } });
}

// Fetch purchases for reports
export async function fetchPurchases(filters,page, rowsPerPage = 100) {
    return await authApi.fetch("/purchases", { sort: ['createdAt:desc'], pagination: { page, pageSize: rowsPerPage } });
}

//fetchCategories 
export async function fetchCategories(page, rowsPerPage) {
    return await authApi.fetch("/categories", { sort: ["name:asc"], pagination: { page, pageSize: rowsPerPage ?? 100 } });
}

//fetchBrands
export async function fetchBrands(page, rowsPerPage) {
    return await authApi.fetch("/brands", { sort: ["name:asc"], pagination: { page, pageSize: rowsPerPage ?? 100 } });
}


// Fetch a sale or purchase by id or invoice_no
export async function fetchSaleByIdOrInvoice(id) {
    let res;
    res = await authApi.get("/sales/", {
        filters: {
            $or: [{ invoice_no: id }, { id }, { documentId: id }]
        },
        populate: { items: { populate: ["items"] } }
    });
    let data = res?.data?.data ?? res?.data;
    return Array.isArray(data) ? data[0] : data;
}

export async function fetchPurchaseByIdDocumentIdOrPO(id) {
    let res;
    let { url, relations } = urlAndRelations('purchases', id)
    
    res = await authApi.get(url);
    let data = dataNode(res);
    return Array.isArray(data) ? data[0] : data;
}


export async function fetchEnumsValues(name, field) {

    const res = await authApi.fetch(`/enums/${name}/${field}`);
    console.log('res',res)
    let data = dataNode(res);
    return data?.values;
}