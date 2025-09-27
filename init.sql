-- MYSQL (8.0) 
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
  total_amount DECIMAL(10, 2) NOT NULL,
  reservation_id VARCHAR(16),
  payment_method ENUM('cash', 'card', 'online', 'postpaid') NOT NULL,
  online_provider ENUM('momo', 'zalopay'),
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

CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(16) NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    search_query_normalized VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FULLTEXT(search_query_normalized),
    UNIQUE (user_id, search_query),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- USERS
CREATE INDEX idx_users_username ON users(username);   
CREATE INDEX idx_users_email ON users(email);        
CREATE INDEX idx_users_phone ON users(phone_number);

-- ADDRESSES
CREATE INDEX idx_addresses_lat_lng ON addresses(latitude, longitude);

-- USER_ADDRESSES
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_address ON user_addresses(address_id);

-- RESTAURANTS
CREATE INDEX idx_restaurants_address ON restaurants(address_id);
CREATE INDEX idx_restaurants_name ON restaurants(name); -- đã FULLTEXT(name, description), nhưng BTREE index giúp tìm chính xác

-- RESTAURANT_SCHEDULES
CREATE INDEX idx_schedules_restaurant ON restaurant_schedules(restaurant_id);
CREATE INDEX idx_schedules_day ON restaurant_schedules(day_of_week);

-- RESTAURANT_MANAGERS
CREATE INDEX idx_managers_restaurant ON restaurant_managers(restaurant_id);

-- FOODS
CREATE INDEX idx_foods_restaurant ON foods(restaurant_id);
CREATE INDEX idx_foods_name ON foods(name); -- bổ sung BTREE song song với FULLTEXT

-- FOOD_CATEGORIES
CREATE INDEX idx_categories_restaurant ON food_categories(restaurant_id);

-- FOOD_CATEGORY_MAPPING
CREATE INDEX idx_food_mapping_food ON food_category_mapping(food_id);
CREATE INDEX idx_food_mapping_category ON food_category_mapping(food_category_id);

-- TABLES
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);

-- RESERVATIONS
CREATE INDEX idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_table ON reservations(table_id);
CREATE INDEX idx_reservations_datetime ON reservations(reservation_datetime);

-- BILLS
CREATE INDEX idx_bills_restaurant ON bills(restaurant_id);
CREATE INDEX idx_bills_user ON bills(user_id);
CREATE INDEX idx_bills_status ON bills(order_status);
CREATE INDEX idx_bills_payment_status ON bills(payment_status);

-- BILL_ITEMS
CREATE INDEX idx_bill_items_bill ON bill_items(bill_id);
CREATE INDEX idx_bill_items_food ON bill_items(food_id);

-- REVIEWS
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_bill ON reviews(bill_id);

-- SEARCH_HISTORY
CREATE INDEX idx_search_history_user ON search_history(user_id);


INSERT INTO users (user_id, username, name, password) VALUES ('12345678910', 'team1', 'cdio team 1', '$2a$10$jpChleT2FvfRp/E39jKn5uet5wTL6TZrUu5n67q5dX4Scw6jx34xu')


