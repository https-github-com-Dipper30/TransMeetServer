export interface User {
  username: string,
  password: string,
  role_id: number,
  role?: string,
  [key: string]: any,
}

export interface HomeCustomer extends User {
  marriage_status: number,
  gender: number,
  birth: number,
  annual_income: number,
  street: string,
  city: string,
  state: number,
  zip_code: number,
}

export interface BusinessCustomer extends User {
  annual_income: number,
  street: string,
  city: string,
  state: number,
  zip_code: number,
  cate: string,
}

export interface Admin extends User {
  name: string,
}