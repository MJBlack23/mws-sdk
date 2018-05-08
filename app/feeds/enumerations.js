module.exports = [
  // Inventory Feeds
  '_POST_PRODUCT_DATA_', // Product Feed
  '_POST_INVENTORY_AVAILABILITY_DATA_', // Inventory Feed
  '_POST_PRODUCT_OVERRIDES_DATA_', // Overrides Feed
  '_POST_PRODUCT_PRICING_DATA_', // Pricing Feed
  '_POST_PRODUCT_IMAGE_DATA_', // Product Image Feed
  '_POST_PRODUCT_RELATIONSHIP_DATA_', // Relationships Feed
  '_POST_FLAT_FILE_INVLOADER_DATA_', // Flat file inventory loader feed
  '_POST_FLAT_FILE_LISTINGS_DATA_', // Flat file listings feed
  '_POST_FLAT_FILE_BOOKLOADER_DATA_', // Flat file book loader
  '_POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA_', // Flat file music loader
  '_POST_FLAT_FILE_LISTINGS_DATA_', // Flat file video loader
  '_POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA_', // Flat file price and quantity feed
  '_POST_UIEE_BOOKLOADER_DATA_', // UIEE Inventory Feed
  '_POST_STD_ACES_DATA_', // ACES 3.0 Data

  // Order Feeds
  '_POST_ORDER_ACKNOWLEDGEMENT_DATA_', // Order acknowledgement feed
  '_POST_PAYMENT_ADJUSTMENT_DATA_', // Order adjustments feed
  '_POST_ORDER_FULFILLMENT_DATA_', // Order Fulfillment feed
  '_POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA_', // Flat file order cancellation feed
  '_POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA_', // Flat file order adjustment feed
  '_POST_FLAT_FILE_FULFILLMENT_DATA_', // Flat file order fulfillment feed

  // FBA Feeds
  '_POST_FULFILLMENT_ORDER_REQUEST_DATA_', // FBA Fulfillment Order Feed
  '_POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_', // FBA Order Cancellation Feed
  '_POST_FBA_INBOUND_CARTON_CONTENTS_', // FBA Inbound shipment carton information feed
  '_POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA_', // Flat file FBA fulfillment order feed
  '_POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_', // Flat file FBA order cancellation feed
  '_POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN_', // Flat file FBA create inbound shipment plan feed
  '_POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN_', // Flat file FBA update inbound shipment plan feed
  '_POST_FLAT_FILE_FBA_CREATE_REMOVAL_', // Flat file FBA create removal feed

  // Business Feeds
  '_POST_ENHANCED_CONTENT_DATA_', // Flat file product documents feed
];
