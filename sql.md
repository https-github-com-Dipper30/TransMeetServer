# User

create table user (
  id int primary,
  username varchar(15),
  password varchar(20),
  role_id int foreign key role (id),
)

// admin, (region)manager, store lord, salesman, home, business

create table role (
  id int primary,
  name varchar(255),
  type int,
)

create table access (
  id int primary,
  name varchar(255),
  type int,
)

create table role_access (
  id int primary,
  rid int foreign key role (type),
  aid int foreign key access (type),
)

create table category (
  id int primary,
  name varchar(255),
  code int,
)

create table type (
  id int primary,
  name varchar(255),
  code int,
  cate_code int foreign key references category(code),
)

create table home_customer (
  id int not null primary,
  marriage_status int, 0-single 1-married 2-divorced
  gender int,
  birth int,
  phone varchar(255),
  email varchar(255),
  annual_income ,
  street varchar(255),
  city varchar(55),
  state_id int,
  zip_code int,
  uid int foreign key user (id),
)

create table business_customer (
  id int primary,
  cate varchar(25),
  annual_income bigint,
  phone varchar(255),
  email varchar(255),
  street varchar(255),
  city varchar(55),
  state_id int,
  zip_code int,
  uid int foreign key user (id),
)

create Table admin (
  id int not null primary,
  name varchar(255),
  uid int foreign key user (id),
)

create Table staff (
  id int not null primary,
  name varchar(55),
  job_title int, 1 - salesperson 2 - store manager 3 - region manager
  store_assigned int,
  region_assigned int,
  salary bigint,
)

<!-- create Table access {
  id int not null primary,
  type int unique,
  user_id
} -->

create Table region {
  id int not null primary,
  name varchar(255),
  manager_id int foreign key salesperson(id),
}

create Table store (
  id int primary,
  manager_id int foreign key staff(id),
  name varchar(255) not null,
  street varchar(255) not null,
  state_id int not null,
  zip_code int not null,
  region_id int foreign key region(id),
)

<!-- create table store_staff (
  id int not null primary,
  store_id int foreign key store(id),
  staff_id int foreign key staff(id),
) -->

create Table product (
  id int not null primary,
  name varchar(255),
  amount int min(0),
  price bigint,
  unit varchar(255),
  cate int,
  type int,
  description varchar(255),
  createTS int,
  listTS int
)

create Table cartitem (
  id int not null primary,
  uid int foreign key user(id),
  pid int foreign key product(id),
  sid int foreign key store(id),
  amount int min(0),
  selected boolean
  <!-- status int, // selected? -->
)

create Table product_store (
  id int not null primary,
  pid int foreign key product(id),
  sid int foreign key store{id}
)

<!-- create Table order {
  id int not null primary,
  order_no varchar(255) unique,
  product_id int foreign key product(id),
  product_quantity int,
  unit_price bigint,
  payment bigint,
  tran
} -->

<!-- create table transaction_order (
  id int not null primary,
  tid int foreign key transaction (id),
  oid int foreign key order (id),
) -->

<!-- create table comments (
  id int primary,
  comment varchar(255),
  rate int, // 1~5
  start_ts int, // 10位时间戳
  expire_in int, // 10位时间戳
  status int,
  order_no int foreign key references order(order_no),
  user_id int foreign key references user(id),
) -->

<!-- Order and Transaction -->
<!-- rate number 0-5, 0 means not rated -->
create table order (
  id string primary,
  uid int foreign key references User(id),
  pid int foreign key references Product(id),
  sid int foreign key references Store(id),
  staff int foreign key references Staff(id),
  price int,
  amount int,
  time int,
  status int,
  rate int 
  <!-- tid int, // transaction id -->
)

<!-- create table transaction (
  id string primary,
  time int, // unix timestamp
) -->

create table rate (
  id int primary,
  pid int foreign key references Product(id),
  value int, // 1-5
)
