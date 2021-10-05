export enum errCode {
  // auth error code
  REGISTRATION_FAILURE = 10000,
  LOGIN_FAILURE = 10001,
  TOKEN_FAILURE = 10002,
  ACCESS_FAILURE = 10003,
  AUTH_FAILURE = 10004, // default

  // product error code
  PRODUCT_FAILURE = 30000,
  PRODUCT_NOT_FOUND = 30004,
  PRODUCT_SOLD_OUT = 30005,
  
  // common error
  PAGE_FAILURE = 40000,
  PAGE_REDIRECTED = 40001,
  PARAMETER_FAILURE = 40003,
  PAGE_NOT_FOUND = 40004,

  // transaction error
  ORDER_FAILURE = 50000,
  ORDER_NOT_FOUND = 50001,

  TRANSACTION_FAILURE = 50020,
  TRANSACTION_NOT_FOUND = 50021,

  // user error code
  USER_FAILURE = 60000,

  // store error code
  STORE_FAILURE = 70000,

  // product error code

}