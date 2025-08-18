
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if ("purchase" === 'sale') {
      data.invoice_no = 'INV-' + Date.now();
    }
    if ("purchase" === 'purchase') {
      data.purchase_no = 'PO-' + Date.now();
    }
    if ("purchase".includes('return')) {
      data.return_no = 'RET-' + Date.now();
    }
  },
  async afterCreate(event) {
    const { result } = event;
    // Stock update logic here
  }
};
