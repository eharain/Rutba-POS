
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("purchase-item" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("purchase-item" === 'purchase-order') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("purchase-item".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
