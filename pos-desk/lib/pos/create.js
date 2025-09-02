import qs from 'qs';
import { authApi } from '../api';
import { generateNextInvoiceNumber, generateNextPONumber, getBranch, getUser } from '../utils';

// Create a new sale or purchase entity
export async function createNewEntity(name) {
    let data = {};
    let nameSinglar = name.endsWith('s') ? name.slice(0, -1) : name;
    let namePlural = name.endsWith('s') ? name : name + 's';
    const user = getUser();
    const branch = getBranch();
    if (name === 'sales' || name === 'sale') {
        data = {
            invoice_no: generateNextInvoiceNumber(),
            sale_date: new Date().toISOString(),
            total: 0,
            users: {
                connect: [user.id],
                disconnect: [],
            }
        };
    } else if (name === 'purchases' || name === 'purchase') {

        data = {
            purchase_no: generateNextPONumber(),
            order_date: new Date().toISOString(),
            total: 0,
            users: {
                connect: [user.id],
                disconnect: [],
            },
        };
    } else if (name === 'product' || name === 'products') {

        data = {
            cost_price: 0,
            selling_price: 0,
            reorder_level: 1,
            is_active: false,
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
    const id = rdata.purchase_no ?? rdata.invoice_no ?? rdata.documentId ?? rdata.id;
    return { data: rdata, id, nameSinglar, namePlural };
}