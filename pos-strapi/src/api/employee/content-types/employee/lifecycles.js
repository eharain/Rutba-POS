
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("employee" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("employee" === 'purchase-order') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("employee".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
