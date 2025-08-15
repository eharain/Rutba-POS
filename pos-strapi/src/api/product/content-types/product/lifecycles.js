
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("product" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("product" === 'purchase-order') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("product".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
