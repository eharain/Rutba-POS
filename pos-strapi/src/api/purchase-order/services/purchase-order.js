'use strict';

/**
 * purchase-order service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::purchase-order.purchase-order');
