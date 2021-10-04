export enum errCode {
  // auth error code
  PASSWORD_FAILURE = 10000,
  ACCESS_FAILURE = 10001,
  TOKEN_FAILURE = 10002,

  // page router error code
  PAGE_FAILURE = 4000,
  PAGE_REDIRECTED = 40001,
  PAGE_NOT_FOUND = 40004,

  // common error
  PARAMETER_FAILURE = 50000,

  // user error code
  USER_FAILURE = 60000
}