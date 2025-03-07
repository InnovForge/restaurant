import { pool } from "../configs/mysql.js";
import { getFoods } from "../controllers/food.js";
import { nanoidNumbersOnly } from "../utils/nanoid.js";

const restaurantModel = {
  /**
   * Update a restaurant
   * @param {string} restaurantId - ID of the restaurant
   * @param {Object} restaurantData - Data of the restaurant
   * @param {string} restaurantData.name - Name of the restaurant
   * @param {Object} restaurantData.address - Address of the restaurant
   * @param {string} restaurantData.phoneNumber - Phone number of the restaurant
   * @param {string} restaurantData.coverUrl - Cover URL of the restaurant
   */
  async updateRestaurant(restaurantId, restaurantData) {
    console.log("is data:", restaurantData);
    const address = restaurantData?.address;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(restaurantData)) {
        if (value !== undefined && value !== null) {
          if (key !== "address") {
            values.push(value);
            fields.push(`${key} = ?`);
          }
        }
      }
      if (fields.length !== 0) {
        values.push(restaurantId);
        const sql = `UPDATE restaurants SET ${fields.join(", ")} WHERE restaurant_id = ?`;
        // console.log(sql);
        await connection.query(sql, values);
      }

      const fieldsAddress = [];
      const valuesAddress = [];
      if (address) {
        for (const [key, value] of Object.entries(address)) {
          if (value !== undefined && value !== null) {
            valuesAddress.push(value);
            fieldsAddress.push(`${key} = ?`);
          }
        }
        if (fieldsAddress.length !== 0) {
          valuesAddress.push(restaurantId);
          const sqlAddress = `UPDATE addresses SET ${fieldsAddress.join(", ")} WHERE address_id = ?`;
          await connection.query(sqlAddress, valuesAddress);
        }
      }
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error(error);
    } finally {
      connection.release();
    }
  },

  /*
   * Create a restaurant
   * @param {string} userId - ID of the user who creates the restaurant
   * @param {Object} restaurantData - Data of the restaurant
   * @param {string} restaurantData.name - Name of the restaurant
   * @param {Object} restaurantData.address - Address of the restaurant
   * @param {string} restaurantData.phoneNumber - Phone number of the restaurant
   * @param {string} restaurantData.coverUrl - Cover URL of the restaurant
   */
  async createRestaurant(userId, restaurantData) {
    const { name, address, phoneNumber, email } = restaurantData;
    const { addressLine1, addressLine2, longitude, latitude } = address;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const addressId = nanoidNumbersOnly();
      const restaurantId = nanoidNumbersOnly();

      await connection.query(
        "INSERT INTO addresses (address_id, address_line1, address_line2, longitude, latitude) VALUES (?, ?, ?, ?, ?)",
        [addressId, addressLine1, addressLine2, longitude, latitude],
      );

      await connection.query(
        "INSERT INTO restaurants (restaurant_id, name, phone_number,email, address_id) VALUES (?, ?, ?, ?, ?)",
        [restaurantId, name, phoneNumber, email, addressId],
      );

      await connection.query("INSERT INTO restaurant_managers (user_id, restaurant_id, role) VALUES (?, ?, ?)", [
        userId,
        restaurantId,
        "owner",
      ]);

      await connection.commit();
      return restaurantId;
    } catch (error) {
      await connection.rollback();
      throw new Error(error);
    } finally {
      connection.release();
    }
  },

  async getUserRestaurantRole(userId, restaurantId) {
    const [rows] = await pool.query("SELECT role FROM restaurant_managers WHERE user_id = ? AND restaurant_id = ?", [
      userId,
      restaurantId,
    ]);
    return rows.length > 0 ? rows[0].role : null;
  },

  async getRestaurant(restaurantId) {
    const [rows] = await pool.query(
      `SELECT r.restaurant_id, r.name, r.description, r.logo_url, r.cover_url, r.phone_number,r.email, a.address_line1, a.address_line2, a.longitude, a.latitude,  COUNT(re.review_id) AS total_reviews, COALESCE(AVG(re.rating), 0) AS average_rating, COALESCE(
        (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'day_of_week', rs.day_of_week,
                'opening_time', TIME_FORMAT(rs.opening_time, '%H:%i'),
                'closing_time', TIME_FORMAT(rs.closing_time, '%H:%i')
            )
        ) 
        FROM restaurant_schedules rs 
        WHERE rs.restaurant_id = r.restaurant_id AND rs.is_closed = FALSE
        ), 
        '[]'
    ) AS opening_hours 
      FROM restaurants r
      JOIN addresses a ON r.address_id = a.address_id
      LEFT JOIN bills b ON b.restaurant_id = r.restaurant_id
      LEFT JOIN reviews re ON re.bill_id = b.bill_id
      WHERE r.restaurant_id = ?
      GROUP BY r.restaurant_id, a.address_id;
`,
      [restaurantId],
    );
    if (rows[0]?.opening_hours.length > 0) {
      rows[0].opening_hours = JSON.parse(rows[0].opening_hours);
    }
    return rows[0];
  },

  async getRestaurantByUserId(userId) {
    const [rows] = await pool.query(
      `
SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    r.description,
    r.phone_number,
    r.email,
    r.logo_url,
    r.cover_url,
    rm.role,
    a.address_line1,
    a.address_line2,
    r.created_at,
    r.updated_at
FROM 
    restaurant_managers rm
JOIN 
    restaurants r ON rm.restaurant_id = r.restaurant_id
JOIN 
    addresses a ON r.address_id = a.address_id
WHERE 
    rm.user_id = ?;

`,
      [userId],
    );
    return rows;
  },

  /**
   * Check if the email is already used by another restaurant
   * @param {string} email - Email to check
   * @returns Promise<boolean> - True if the email is already used, false otherwise
   */
  async checkEmailExist(email) {
    const [rows] = await pool.query(`SELECT email FROM restaurants WHERE email = ?`, [email]);
    return rows.length > 0;
  },

  async checkPhoneExist(phoneNumber) {
    const [rows] = await pool.query(`SELECT phone_number FROM restaurants WHERE phone_number = ?`, [phoneNumber]);
    return rows.length > 0;
  },

  async GetAllFoodByResId(restaurantId) {
    const [rows] = await pool.query(
      `SELECT  * FROM foods f WHERE f.restaurant_id = ?;
`,
      [restaurantId],
    );
    return rows;
  },

  async getPopularRestaurants(latitude, longitude, radius = 10000, limit = 10, offset = 0) {
    const query = `SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    r.logo_url AS restaurant_logo,
    r.cover_url AS restaurant_cover,
    r.description AS restaurant_description,
    a.address_line1, 
    a.address_line2, 
    a.latitude,
    a.longitude,
    (
        6371000 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(a.latitude)) * 
            COS(RADIANS(a.longitude) - RADIANS(?)) + 
            SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
        )
    ) AS estimated_distance,
   COUNT(DISTINCT bi.bill_id) AS  total_orders,
   COALESCE(ROUND(AVG(br.rating), 1), 0) AS average_rating,
   COALESCE(COUNT(br.review_id), 0) AS total_reviews
FROM restaurants r 
JOIN addresses a ON a.address_id = r.address_id
LEFT JOIN foods f ON f.restaurant_id= r.restaurant_id
LEFT JOIN bill_items bi ON f.food_id = bi.food_id
LEFT JOIN bills b ON bi.bill_id = b.bill_id AND b.order_status = 'completed'
LEFT JOIN reviews br  ON b.bill_id = br.bill_id
GROUP BY r.restaurant_id, a.address_id
HAVING estimated_distance <= ?
ORDER BY COUNT(b.bill_id) DESC, estimated_distance ASC
LIMIT ? OFFSET ?;
`;
    const [foods] = await pool.query(query, [latitude, longitude, latitude, radius, limit, offset]);
    return foods;
  },

  async searchRestaurantsNearby(latitude, longitude, radius = 10000, limit = 10, offset = 0, keyword = "") {
    const query = `
        SELECT 
            r.restaurant_id,
            r.name AS restaurant_name,
            r.logo_url AS restaurant_logo,
            r.cover_url AS restaurant_cover,
            r.description AS restaurant_description,
            a.address_line1, 
            a.address_line2, 
            a.latitude,
            a.longitude,
            (
                6371000 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(a.latitude)) * 
                    COS(RADIANS(a.longitude) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(a.latitude))
                )
            ) AS estimated_distance,
           COUNT(DISTINCT bi.bill_id) AS  total_orders,
           COALESCE(ROUND(AVG(br.rating), 1), 0) AS average_rating,
           COALESCE(COUNT(br.review_id), 0) AS total_reviews
        FROM restaurants r
        JOIN addresses a ON a.address_id = r.address_id
        LEFT JOIN foods f ON f.restaurant_id= r.restaurant_id
        LEFT JOIN bill_items bi ON f.food_id = bi.food_id
        LEFT JOIN bills b ON bi.bill_id = b.bill_id AND b.order_status = 'completed'
        LEFT JOIN reviews br  ON b.bill_id = br.bill_id
        WHERE MATCH(r.name, r.description) AGAINST (? IN BOOLEAN MODE)
        GROUP BY r.restaurant_id, a.address_id
        HAVING estimated_distance <= ?
        ORDER BY estimated_distance ASC
        LIMIT ? OFFSET ?;
    `;

    const params = [latitude, longitude, latitude, keyword, radius, limit, offset];
    const [restaurants] = await pool.query(query, params);
    return restaurants;
  },

  async getFoodsByRestaurantId(restaurantId) {
    const query = `WITH PopularFoods AS (
    SELECT 
        f.food_id,
        f.name AS food_name,
        f.description,
        f.price,
        f.price_type,
        f.image_url,
        f.available,
        COUNT(DISTINCT bi.bill_id) AS order_count,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
        COALESCE(COUNT(r.review_id), 0) AS total_reviews
    FROM foods f
    LEFT JOIN bill_items bi ON f.food_id = bi.food_id
    LEFT JOIN bills b ON bi.bill_id = b.bill_id AND b.order_status = 'completed'
    LEFT JOIN reviews r ON b.bill_id = r.bill_id
    WHERE f.restaurant_id = ?
    GROUP BY f.food_id, f.name, f.description, f.price, f.price_type, f.image_url, f.available  
    ORDER BY order_count DESC, avg_rating DESC
    LIMIT 5
)

SELECT 
    'popular' AS food_category_id,
    'Phổ biến' AS category_name,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'food_id', PopularFoods.food_id,
            'food_name', PopularFoods.food_name,
            'food_description', PopularFoods.description,
            'price', PopularFoods.price,
            'price_type', PopularFoods.price_type,
            'food_image', PopularFoods.image_url,
            'available', PopularFoods.available,
            'total_reviews', PopularFoods.total_reviews,
            'average_rating', PopularFoods.avg_rating
        )
    ) AS foods
FROM PopularFoods 

UNION ALL

SELECT 
    fc.food_category_id, 
    fc.name AS category_name,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'food_id', t.food_id,
                'food_name', t.food_name,
                'food_description', t.description,
                'price', t.price,
                'price_type', t.price_type,
                'food_image', t.image_url,
                'available', t.available,
                'total_orders', t.total_orders,
                'total_reviews', t.total_reviews,
                'average_rating', t.avg_rating
            )
        )
        FROM (
            SELECT 
                f.food_id,
                f.name AS food_name,
                f.description,
                f.price,
                f.price_type,
                f.image_url,
                f.available,
                COALESCE(SUM(bi.quantity), 0) AS total_orders,
                COALESCE(COUNT(DISTINCT br.review_id), 0) AS total_reviews,
                COALESCE(ROUND(AVG(br.rating), 1), 0) AS avg_rating
            FROM foods f
            LEFT JOIN bill_items bi ON bi.food_id = f.food_id
            LEFT JOIN bills b ON b.bill_id = bi.bill_id AND b.order_status = 'completed'
            LEFT JOIN reviews br ON br.bill_id = b.bill_id
            WHERE f.food_id IN (
                SELECT fcm.food_id 
                FROM food_category_mapping fcm 
                WHERE fcm.food_category_id = fc.food_category_id
            )
            GROUP BY f.food_id, f.name, f.description, f.price, f.price_type, f.image_url, f.available
        ) t
    ) AS foods
FROM food_categories fc
WHERE fc.restaurant_id = ? 
AND EXISTS (
    SELECT 1 FROM food_category_mapping fcm 
    JOIN foods f ON fcm.food_id = f.food_id
    WHERE fcm.food_category_id = fc.food_category_id
);
`;

    const [foods] = await pool.query(query, [restaurantId, restaurantId]);
    return foods;
  },
};

export default restaurantModel;
