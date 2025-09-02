
import qs from 'qs';
import { authApi } from '../api';


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

//saveProductItems
export async function saveProductItems(id, items) {
    return await authApi.put(`/products/${id}`, {
        data: {
            items: items.map((i) => ({
                stock_item: i.stock_item.id,
                quantity: i.quantity,
                price: i.price,
            })),
        },
    });
}

