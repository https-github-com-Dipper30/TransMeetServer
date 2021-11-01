import { Pager } from './common'
export interface StoreType {
  manager_id?: number|null,
  region_id: number,
  name: string,
  city: string,
  street: string,
  state_id: number,
  zip_code: number,
}

export interface GetStore {
  id?: number,
  manager_id?: number,
  region_id?: number,
  state_id?: number,
}

export interface SetStoreManager {
  manager_id: number,
  store_id: number,
}

export interface ProductType {
  name: string,
  amount: number,
  price: number,
  cate: number,
  type: number,
  description?: string,
  createTS: number,
  listTS?: number|null,
  imgSrc?: string|null,
}

export interface ListProduct {
  pid: number,
  sid: number[],
}

export interface GetProduct {
  cate?: number,
  type?: number,
  pid?: number,
  sid?: number,
  price?: number,
  listed?: boolean,
  available?: boolean,
}