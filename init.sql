CREATE TABLE IF NOT EXISTS users (
  user_id NVARCHAR(16) PRIMARY KEY,
  username NVARCHAR(30) NOT NULL UNIQUE,
  name NVARCHAR(30) NOT NULL,
  password NVARCHAR(60) NOT NULL,
  email NVARCHAR(255),
  phone NVARCHAR(15),
  address NVARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now() 
);

CREATE TABLE IF NOT EXISTS restaurants (
  restaurant_id NVARCHAR(16) PRIMARY KEY, 
  restaurant_name NVARCHAR(100) NOT NULL,        
  avatar_url NVARCHAR(255),
  address NVARCHAR(255),                           
  phone NVARCHAR(15),                              
  email NVARCHAR(255),                             
  total_tables INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),     
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW() 
);
--
-- CREATE TABLE IF NOT EXISTS restaurant_users (
--   restaurant_user_id NVARCHAR(16) PRIMARY KEY,
--   user_id NVARCHAR(16) NOT NULL, 
--   restaurant_id NVARCHAR(16) not NULL,   
--   role ENUM('restaurant_owner', 'manager') NOT NULL,  
--   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
--   updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
--   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
--   CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
-- );

