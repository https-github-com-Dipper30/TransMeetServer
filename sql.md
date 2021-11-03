# User

create table user {
  id: int primary,
  username: varchar(15), //
  password: varchar(20),
  role_id: int foreign key role (id),
}

// admin, (region)manager, store lord, salesman, home, business

create table role {
  id: int primary,
  name: varchar(255),
  type: int,
}

create table access {
  id: int primary,
  name: varchar(255),
  type: int,
}

create table role_access {
  id: int primary,
  rid: int foreign key role (id),
  aid: int foreign key access (id),
}

create table category {
  id: int primary,
  name: varchar(255),
  code: int,
}

create table category {
  id: int primary,
  name: varchar(255),
  code: int,
  cate_code: int foreign key references category(code),
}

create table home_customer (
  id: int not null primary,
  marriage_status: int, 0-single 1-married 2-divorced
  gender: int,
  birth: int, // 10 digits ts
  annual_income: ,
  street: varchar(255), // 0 < len <= 30
  city: varchar(55), // 0 < len <= 20
  state_id: int,
  zip_code: int,
  uid: int foreign key user (id),
)

create table business_customer (
  id: int primary,
  cate: varchar(25),
  annual_income: bigint,
  street: varchar(255), // 0 < len <= 30
  city: varchar(55), // 0 < len <= 20
  state_id: int,
  zip_code: int,
  uid: int foreign key user (id),
)

create Table admin (
  id: int not null primary,
  name: varchar(255),
  uid: int foreign key user (id),
)

create Table staff (
  id: int not null primary,
  name: varchar(55),
  job_title: int, 1 - salesperson 2 - store manager 3 - region manager
  store_assigned: int,
  region_assigned: int,
  salary: bigint,
)

<!-- create Table access {
  id: int not null primary,
  type: int unique,
  user_id:
} -->

create Table region {
  id: int not null primary,
  name: varchar(255),
  manager_id: int foreign key salesperson(id),
}

create Table store (
  id: int not null primary,
  manager_id: int foreign key staff(id),
  name: varchar(255),
  street: varchar(255),
  state_id: int,
  zip_code: int,
  region_id: int foreign key region(id),
)

<!-- create table store_staff (
  id: int not null primary,
  store_id: int foreign key store(id),
  staff_id: int foreign key staff(id),
) -->

create Table product {
  id: int not null primary,
  name: varchar(255),
  amount: int min(0),
  price: bigint,
  unit: varchar(255), // the unit price of the product is [price] $ / [unit], for example 99.99$ / 1 packet
  cate: int, // first order
  type: int, // second order
  description: varchar(255),
  createTS: int, // unix timestamp of creation
  listTS: int, // timestamp of when the product is listed
}

create Table cart_item {
  id: int not null primary,
  user_id: nt foreign key user(id),
  product_id: int foreign key product(id),
  store_id: int foreign key store(id),
  product_amount: int min(0),
  status: int, // selected?
}

create Table product_store {
  id: int not null primary,
  pid: int foreign key product(id),
  sid: int foreign key store{id},
}

<!-- create Table order {
  id: int not null primary,
  order_no: varchar(255) unique,
  product_id: int foreign key product(id),
  product_quantity: int,
  unit_price: bigint,
  payment: bigint,
  tran
} -->

create Table transaction {
  id: int not null primary,
  customer_id: int foreign key customer(id),
  total_price: bigint, // 原价
  extra_fee: bigint, // 其他费用，如运费
  payment: bigint, // 实付金钱
  status: int, // 交易状态
  start_ts: int, // 交易发起时间戳
  end_ts: int, // 交易结束时间戳
}

<!-- create table transaction_order (
  id: int not null primary,
  tid: int foreign key transaction (id),
  oid: int foreign key order (id),
) -->

create Table order {
  id: int not null primary,
  order_no: varchar(255) unique,
  customer_id: int foreign key customer(id),
  product_id: int foreign key product(id),
  store_id: int foreign key store(id)
  product_amount: int,
  salesperson_id: int foreign key staff(id),
  transaction_id: int foreign key transaction(id),
}

create table comments (
  id: int primary,
  comment: varchar(255),
  rate: int, // 1~5
  start_ts: int, // 10位时间戳
  expire_in: int, // 10位时间戳
  status: int,
  order_no: int foreign key order(order_no),
  user_id: int foreign key user(id),
)