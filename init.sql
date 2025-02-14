-- MYSQL (9.1.0) 
-- cdio@team1

-- DROP TABLE IF EXISTS users, addresses, user_addresses, restaurants, restaurant_managers, food_categories, foods, bills , food_category_mapping, bill_items , reviews, reservations;

CREATE TABLE IF NOT EXISTS users (
  	user_id VARCHAR(16) PRIMARY KEY,
  	name VARCHAR(60) NOT NULL,
  	gender TINYINT CHECK (gender IN (0, 1, 2, 9)), -- 0 unknown / 1 male / 2 female  / 0  "Not applicable / Not disclosed"
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
	longitude DECIMAL(11,8),
	latitude DECIMAL(10,8),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW() 
);

CREATE TABLE IF NOT EXISTS user_addresses (
	user_address_id VARCHAR(16) PRIMARY KEY,
	address_id VARCHAR(16) NOT NULL,
	user_id VARCHAR(16) NOT NULL,
	phone_number VARCHAR(15),
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
	restaurant_id VARCHAR(16) PRIMARY KEY,
	name VARCHAR(100),
	address_id VARCHAR(16) UNIQUE NOT NULL,
	phone_number VARCHAR(15),
	logo_url VARCHAR(255),
	cover_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE
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
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_categories (
    food_category_id VARCHAR(16) PRIMARY KEY,
    restaurant_id VARCHAR(16) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (restaurant_id, name),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_category_mapping (
    food_id VARCHAR(16) NOT NULL,
    food_category_id VARCHAR(16) NOT NULL,
    PRIMARY KEY (food_id, food_category_id),
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE,
    FOREIGN KEY (food_category_id) REFERENCES food_categories(food_category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id VARCHAR(16) PRIMARY KEY,
    restaurant_id VARCHAR(16) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    table_number INT NOT NULL,
    reservation_datetime TIMESTAMP DEFAULT NOW() NOT NULL,
    reservation_status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bills (
	bill_id VARCHAR(16) PRIMARY KEY,
	restaurant_id VARCHAR(16) NOT NULL,
	user_id VARCHAR(16) NOT NULL,
	order_status ENUM('pending', 'preparing', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
	FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_items (
    bill_item_id VARCHAR(16) PRIMARY KEY,
    bill_id VARCHAR(16) NOT NULL,
    food_id VARCHAR(16),
    reservation_id VARCHAR(16),
    quantity TINYINT NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(16) NOT NULL PRIMARY KEY,
    bill_id VARCHAR(16) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    food_id VARCHAR(16) NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    image_url VARCHAR(255), 
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(food_id) ON DELETE CASCADE
);
