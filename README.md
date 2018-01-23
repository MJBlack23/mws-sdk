# Amazon Merchant Web Services (MWS) Async/Await library

<aside class='warning'>
  ### Warning

  This package is in alpha phase and does not have full support for all MWS APIs.  Use at your own risk.
</aside>

The MWS library is notoriously difficult to work with especically with a language like javascript, that doesn't natively support xml.

This library is the product of working for an ecommerce company that sells on Amazon as a key part of the business.

## Getting started
You can get access to each **available** service by destructuring it off of the main body.

```javascript
  const { Orders, Products } = require('mws-sdk-async');
```

Each API is a a constructor that take accepts a configuration object that follows this format.

```javascript
  const config = {
    mwsHost, // -- optional, defaults to mws.amazonservices.com
    marketplaceId, // -- required, used as the default in each call unless specifically provided
    sellerId, // -- required
    authToken, // -- required
    accessKeyId, // -- required
    secretKey // -- required
  };

  const api = new Orders(config);
```

Alternately, you may use environment variabes to set up your configuration.  The constructor will look for the following environment variables.

```javascript
process.env.MWS_HOST // defaults to mws.amazonservices.com
process.env.MWS_MARKETPLACE_ID // required
process.env.MWS_SELLER_ID // required
process.env.MWS_AUTH_TOKEN // required
process.env.MWS_ACCESS_KEY // required
process.env.MWS_SECRET_KEY // required
```

## Orders API
Base documentation http://docs.developer.amazonservices.com/en_US/orders-2013-09-01/index.html

### List Orders

Throttling:  Max request quota: 6, restore rate: 1 request per minute
```javascript
  let orders = await mws.listOrders({
    CreatedAfter, // optional (see note below), ISO formatted date
    CreatedBefore, // optional (see note below), ISO formatted date
    LastUpdatedAfter, // optional (see note below), ISO formatted date
    LastUpdatedBefore, // optional (see note below), ISO formatted date
    OrderStatus, // optional, *array* containing 1 or more order status
    MarketplaceId, // optional, an *array* of marketplaces -- defaults to the one you specified in your configuration
    FulfillmentChannel, // optional, an *array* containing one or both of: AFN (fulfilled by amazon) or MFN (fulfilled by merchant)
    PaymentMethod, // optional
    BuyerEmail, // optional
    SellerOrderId, // optional
    MaxResultsPerPage, // optional
    TFMShipmentStatus // optional, only available in china
  });
```
<aside class='notice'>
  Note on requests:
  
  * Dates:  You must either specific a CreatedAfter and CreatedBefore timestamp **or** a LastUpdatedAfter/LastUpdatedBefore timestamp, but not both.

  * ISO Format: [ISO Format in MWS](http://docs.developer.amazonservices.com/en_US/dev_guide/DG_ISO8601.html)

  * Order Status enumeration:
    * PendingAvailable (preorder - only available in japan)
    * Pending (payment not completed)
    * Unshipped (must be used together with PartiallyShipped)
    * Shipped
    * InvoiceUnconfirmed (china only)
    * Cancelled
    * Unfulfillable (Amazon fulfilled orders only)
</aside>

Response
```javascript
{
  NextToken,
  Orders: [
    {
      LatestShipDate,
      OrderType,
      PurchaseDate,
      AmazonOrderId,
      BuyerEmail,
      IsReplacementOrder,
      LastUpdateDate,
      NumberOfItemsShipped,
      ShipServiceLevel,
      OrderStatus,
      SalesChannel,
      ShippedByAmazonTFM,
      IsBusinessOrder,
      LatestDeliveryDate,
      NumberOfItemsUnshipped,
      PaymentMethodDetails: { PaymentMethodDetail }
      BuyerName,
      EarliestDeliveryDate,
      OrderTotal: {
        CurrencyCode,
        Amount
      },
      IsPremiumOrder,
      EarliestShipDate,
      MarketplaceId,
      FulfillmentChannel,
      PaymentMethod,
      ShippingAddress: {
        City,
        AddressType,
        PostalCode,
        StateOrRegion,
        Phone,
        CountryCode,
        Name,
        AddressLine1,
        AddressLine2
      },
      IsPrime,
      ShipmentServiceLevelCategory,
      SellerOrderId
    },
  ...
  ]
}
```

### List Orders By Next Token
Throttling:  Max request quota: 6, restore rate: 1 request per minute -- Shared with ListOrders

```javascript
let orders = await mws.listOrdersByNextToken(NextToken);
```

Response:  Same as ListOrders


### List Order Items

Throttling: Max request quote: 30, restore rate: 2 requests per second

```javascript
let items = await mws.listOrderItems(AmazonOrderId);
```

Response
```javascript
{
  AmazonOrderId,
  OrderItems: [
    {
      QuantityOrdered,
      Title,
      ShippingTax: {
        CurrencyCode,
        Amount
      },
      PromotionDiscount: {
        CurrencyCode,
        Amount
      },
      ConditionId,
      IsGift,
      ASIN,
      SellerSKU,
      OrderItemId,
      ProductInfo: {
        CurrencyCode,
        Amount
      },
      GiftWrapTax: {
        CurrencyCode,
        Amount
      },
      QuantityShipped,
      ShippingPrice,
      GiftWrapPrice,
      ConditionSubtypeId,
      ItemPrice: {
        CurrencyCode,
        Amount
      },
      ItemTax: {
        CurrencyCode,
        Amount
      },
      ShippingDiscount: {
        CurrencyCode,
        Amount
      }
    }
  ]
}
```