export enum errCode {
  // auth error code
  REGISTRATION_ERROR = 10000,
  LOGIN_ERROR = 10001,
  TOKEN_ERROR = 10002,
  ACCESS_ERROR = 10003,
  AUTH_ERROR = 10004, // default

  // config error code
  CONFIG_ERROR = 20000,
  STATES_ERROR = 20001,
  REGION_ERROR = 20002,
  BUSINESS_ERROR = 20003,
  STAFF_ERROR = 20004,
  STORE_ALREADY_HAS_MANAGER = 20005,
  REGION_ALREADY_HAS_MANAGER = 20006,
  STORE_NOT_FOUND = 20007,
  REGION_NOT_FOUND = 20008,
  STAFF_NOT_FOUND = 20009,
  REGION_ALREADY_EXISTS = 20010,
  STAFF_ALREADY_EXISTS = 20011,
  STAFF_ALREADY_HAS_JOB = 20012,
  STATE_NOT_FOUND = 20013,

  // product error code
  PRODUCT_ERROR = 30000,
  PRODUCT_NOT_FOUND = 30004,
  PRODUCT_SOLD_OUT = 30005,
  PRODUCT_EXISTS = 30006,
  PRODUCT_ALREADY_LISTED = 30007,
  PRODUCT_NOT_YET_LISTED = 30008,
  
  // common error
  PAGE_ERROR = 40000,
  PAGE_REDIRECTED = 40001,
  PARAMETER_ERROR = 40003,
  PAGE_NOT_FOUND = 40004,
  DATABASE_ERROR = 40005,
  DATABASE_TRANSACTION_ERROR = 40006,
  INVALID_ID = 40007,

  // transaction error
  ORDER_ERROR = 50000,
  ORDER_NOT_FOUND = 50001,
  ORDER_EXISTS = 50002,

  TRANSACTION_ERROR = 50020,
  TRANSACTION_NOT_FOUND = 50021,

  // user error code
  USER_ERROR = 60000,
  USER_EXISTS = 60001,

  // store error code
  STORE_ERROR = 70000,
  STORE_ALREADY_EXISTS = 70001,
  DUPLICATE_STORE_NAME = 70002,

  // file error code
  FILE_ERROR = 80000,
  NO_FILE_UPLOADED = 80001,
  FILE_TYPE_ERROR = 80002,
  DIR_BUILD_ERROR = 80003,
  DIR_NOT_EXISTS = 80004,

  // cart error code
  CART_ERROR = 90000,
}