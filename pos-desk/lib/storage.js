function buildWrapper() {
    function getStore() {
        return localStorage;
        console.debug('[storage] getStore called');
        return {
            getItem: (key) => {
                console.debug(`[storage] getStore.getItem called with key: ${key}`);
                return localStorage.getItem(key);
            },
            setItem: (key, value) => {
                console.debug(`[storage] getStore.setItem called with key: ${key}, value: ${value}`);
                return localStorage.setItem(key, value);
            },
            removeItem: (key) => {
                console.debug(`[storage] getStore.removeItem called with key: ${key}`);
                return localStorage.removeItem(key);
            }
        };
    };

    const wrapper = {
        setItem: function (key, value) {
            console.debug(`[storage] setItem called with key: ${key}, value: ${value}`);
            if (typeof value != 'undefined') {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
        },

        getItem: function (key) {
            console.debug(`[storage] getItem called with key: ${key}`);
            const item = localStorage.getItem(key);
            return item ?? null;
        },

        getJSON: function (key) {
            console.debug(`[storage] getJSON called with key: ${key}`);
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        setJSON: function (key, value) {
            console.debug(`[storage] setJSON called with key: ${key}, value:`, value);
            const s = localStorage;
            if (typeof value != 'undefined') {
                const item = JSON.stringify(value);
                s.setItem(key, item);
            } else {
                s.removeItem(key);
            }
        }
    };
    return wrapper;
}
//export default getStore()

const storage = buildWrapper();

export default storage;
export { buildWrapper, storage };
//export default buildWrapper();

//export storage = { storage: buildWrapper() };
