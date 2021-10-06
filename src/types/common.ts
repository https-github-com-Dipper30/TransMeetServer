export interface Validator {
  readonly checkParams: Function,
  params: any,
  [fn: string]: any,
}

export interface Exception {
  code: number,
  message: string,
}

export interface Account {
  username: string,
  password: string
}