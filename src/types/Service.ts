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