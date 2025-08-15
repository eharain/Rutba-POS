
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("sale-return" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("sale-return" === 'purchase-order') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("sale-return".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
