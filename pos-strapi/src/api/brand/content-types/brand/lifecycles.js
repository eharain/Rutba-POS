
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("brand" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("brand" === 'purchase') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("brand".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
