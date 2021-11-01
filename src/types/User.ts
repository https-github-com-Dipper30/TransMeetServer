import { Pager } from './common'

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
  name: string,
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

export interface Staff {
  name: string,
  job_title: number,
  store_assigned?: number|null,
  region_assigned?: number,
  salary: number,
}

// get request for staff
export interface GetStaff {
  id?: number|null,
  region_assigned?: number|null,
  store_assigned?: number|null,
  job_title?: number|null,
  salary?: number|null,
  page?: number,
  size?: number,
}