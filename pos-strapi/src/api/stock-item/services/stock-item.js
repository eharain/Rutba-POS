'use strict';

/**
 * stock-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::stock-item.stock-item');
