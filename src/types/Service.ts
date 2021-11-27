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
  page?: number,
  size?: number,
}

export interface SetStoreManager {
  manager_id: number,
  store_id: number,
}

export interface ProductType {
  id?: number,
  name: string,
  amount: number,
  price: number,
  cate: number,
  unit: string,
  type: number,
  description?: string,
  createTS?: number,
  listTS?: number|null,
}

export interface ListProduct {
  pid: number,
  sid: number[],
}

export interface GetProduct {
  name?: number,
  cate?: number,
  type?: number,
  pid?: number,
  sid?: number,
  price?: number,
  listed?: boolean,
  available?: boolean, // amount > 0
  pic?: boolean, // if images are required
  page?: number,
  size?: number,
  showStores?: boolean,
  sortDesc?: boolean,
}

export interface AddToCart {
  uid: number,
  pid: number,
  sid: number,
  amount: number,
}

export interface GetCart {
  uid: number,
}

export interface UpdateCart {
  id: number,
  amount?: number,
  selected?: boolean,
}

export interface Order {
  id?: string,
  uid?: number,
  sid: number,
  pid: number,
  staff?: number|null,
  amount: number,
  price: number,
  time?: number,
  status?: boolean,
}

export interface PlaceOrder {
  uid: number,
  time: number,
  totalPrice: number,
  orders: Order[],
}

export interface IsInCart {
  uid: number,
  pid: number,
  sid: number,
}

export interface GetOrder {
  uid?: number,
  pid?: number,
  sid?: number,
  rid?: number,
  oid?: number,
  price?: number,
  staff_assigned?: number,
}