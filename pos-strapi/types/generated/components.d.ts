import type { Schema, Struct } from '@strapi/strapi';

export interface PosSalesDesks extends Struct.ComponentSchema {
  collectionName: 'components_pos_sales_desks';
  info: {
    displayName: 'sales desks';
    icon: 'paperPlane';
  };
  attributes: {
    invoice_prefix: Schema.Attribute.String;
    name: Schema.Attribute.String;
    note: Schema.Attribute.String;
  };
}

export interface PosStockStatusHistory extends Struct.ComponentSchema {
  collectionName: 'components_pos_stock_status_history';
  info: {
    displayName: 'stock statis history';
    icon: 'history';
  };
  attributes: {
    cost_price: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.Date &
      Schema.Attribute.DefaultTo<{
        $now: true;
      }>;
    selling_price: Schema.Attribute.Decimal;
    status: Schema.Attribute.Enumeration<
      [
        'InStock',
        'Reserved',
        'Sold',
        'Returned',
        'ReturnedDamaged',
        'ReturnedToSupplier',
        'Damaged',
        'Lost',
        'Expired',
        'Transferred',
      ]
    > &
      Schema.Attribute.DefaultTo<'InStock'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'pos.sales-desks': PosSalesDesks;
      'pos.stock-status-history': PosStockStatusHistory;
    }
  }
}
