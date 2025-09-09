
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


export async function loadProduct(id) {
    let res = await authApi.get(`/products/${id}`);
    let prod = res.data || res;
    let data = {
        name: prod.name || '',
        sku: prod.sku || '',
        barcode: prod.barcode || '',
        cost_price: prod.cost_price || '',
        selling_price: prod.selling_price || '',
        tax_rate: prod.tax_rate || '',
        stock_quantity: prod.stock_quantity || '',
        reorder_level: prod.reorder_level || '',
        is_active: prod.is_active !== undefined ? prod.is_active : true,
        category: prod.category?.id || '',
        brand: prod.brand?.id || ''
    };
    return data;
}

export async function saveProduct(id, formData) {
    const url = id && id !== 'new' ? `/products/${id}` : '/products';
    const method = id && id !== 'new' ? 'PUT' : 'POST';
    /**the relations like category,brand, users, term-types , terms should be added as connect and disconnect paramter */
    // List of numeric properties to convert
    const numericProps = [
        'cost_price',
        'selling_price',
        'tax_rate',
        'stock_quantity',
        'reorder_level',
        //'category',
        //'brand'
    ];

    // Convert numeric properties to numbers if present
    const convertedFormData = { ...formData };
    numericProps.forEach(prop => {
        if (convertedFormData[prop] !== undefined && convertedFormData[prop] !== '') {
            const num = Number(convertedFormData[prop]);
            if (!isNaN(num)) {
                convertedFormData[prop] = num;
            }
        }
    });

    const data = typeof id == 'string' && containsAlphabet(id)
        ? { ...convertedFormData, documentId: id }
        : { ...convertedFormData, id };

    const response = (method === 'PUT')
        ? await authApi.put(url, data)
        : authApi.post(url, { data });
    return response;
}
function containsAlphabet(str) {
    const regex = /[a-zA-Z]/; // Matches any uppercase or lowercase letter
    return regex.test(str);
}