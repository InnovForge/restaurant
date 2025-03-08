-- MYSQL (9.1.0) 
-- cdio@team1

-- DROP TABLE IF EXISTS users, addresses, user_addresses, restaurants, restaurant_managers, food_categories, foods, bills , food_category_mapping, bill_items , reviews, reservations;

CREATE TABLE IF NOT EXISTS users (
  	user_id VARCHAR(16) PRIMARY KEY,
  	name VARCHAR(60) NOT NULL,
  	gender TINYINT CHECK (gender IN (0, 1, 2, 9)), -- 0 unknown / 1 male / 2 female  / 9  "Not applicable / Not disclosed"
  	username VARCHAR(30) NOT NULL UNIQUE,
  	password VARCHAR(60) NOT NULL,
  	email VARCHAR(255),
  	email_verify BOOLEAN DEFAULT false,
  	avatar_url VARCHAR(255),
  	phone_number VARCHAR(15),
  	phone_verify BOOLEAN DEFAULT false,
  	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW() 
);

CREATE TABLE IF NOT EXISTS addresses (
	address_id VARCHAR(16) PRIMARY KEY,
	address_line1 VARCHAR(255) NOT NULL,
	address_line2 VARCHAR(255),
  longitude DECIMAL(11,8) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW() 
);


CREATE TABLE IF NOT EXISTS user_addresses (
    user_address_id VARCHAR(16) PRIMARY KEY,
    address_id VARCHAR(16) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    phone_number VARCHAR(15),
    is_default BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
	restaurant_id VARCHAR(16) PRIMARY KEY,
	name VARCHAR(100),
  description varchar(255),
  email VARCHAR(255),
	address_id VARCHAR(16) UNIQUE NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE sẽ không hiển thị trên ứng dụng
	phone_number VARCHAR(15),
	logo_url VARCHAR(255),
	cover_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  FULLTEXT(name, description),
	FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurant_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id VARCHAR(16) NOT NULL,
    day_of_week ENUM('0', '1', '2', '3', '4', '5', '6') NOT NULL, -- 0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE nếu đóng cửa cả ngày
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurant_managers (
    user_id VARCHAR(16) NOT NULL,
    restaurant_id VARCHAR(16) NOT NULL,
    role ENUM('owner','manager', 'staff') NOT NULL,
    PRIMARY KEY (user_id, restaurant_id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS foods (
    food_id VARCHAR(16) PRIMARY KEY,
    restaurant_id VARCHAR(16) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_type VARCHAR(3) DEFAULT 'VND',
    image_url VARCHAR(255),
    available bool,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    UNIQUE (restaurant_id, name),
    FULLTEXT(name, description),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_categories (
    food_category_id VARCHAR(16) PRIMARY KEY,
    restaurant_id VARCHAR(16) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (restaurant_id, name),
    FULLTEXT(name),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_category_mapping (
    food_id VARCHAR(16) NOT NULL,
    food_category_id VARCHAR(16) NOT NULL,
    PRIMARY KEY (food_id, food_category_id),
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE,
    FOREIGN KEY (food_category_id) REFERENCES food_categories(food_category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tables (
    table_id VARCHAR(16) PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    restaurant_id VARCHAR(16) NOT NULL,
    seat_count INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id VARCHAR(16) PRIMARY KEY, 
    restaurant_id VARCHAR(16) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    table_id VARCHAR(16) NOT NULL,
    reservation_datetime TIMESTAMP DEFAULT NOW() NOT NULL,
    check_in_time TIMESTAMP,
    reservation_status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bills (
	bill_id VARCHAR(16) PRIMARY KEY,
	restaurant_id VARCHAR(16) NOT NULL,
	user_id VARCHAR(16) NOT NULL,
	order_status ENUM('pending', 'preparing', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
-- "pending" – Đang chờ xử lý
-- "preparing" – Đang chuẩn bị
-- "completed" – Đã hoàn thành
-- "canceled" – Đã hủy
  reservation_id VARCHAR(16),
  payment_method ENUM('cash', 'card', 'online', 'postpaid') NOT NULL,
  payment_status ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
	FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_items (
    bill_item_id VARCHAR(16) PRIMARY KEY,
    bill_id VARCHAR(16) NOT NULL,
    food_id VARCHAR(16),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    name_at_purchase VARCHAR(100) NOT NULL,
    -- reservation_id VARCHAR(16),
    quantity TINYINT NOT NULL,
  --   FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(16) NOT NULL PRIMARY KEY,
    bill_id VARCHAR(16) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    image_url VARCHAR(255), 
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE
);

INSERT INTO users (user_id, username, name, password) VALUES ('12345678910', 'team1', 'cdio team 1', '$2a$10$jpChleT2FvfRp/E39jKn5uet5wTL6TZrUu5n67q5dX4Scw6jx34xu')
