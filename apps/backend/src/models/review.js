import { pool } from "../configs/mysql.js";

const addReview = async ({ review_id, bill_id, user_id, food_id, rating, comment }) => {
  const query = `
    INSERT INTO reviews (review_id, bill_id, user_id, food_id, rating, comment, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const values = [review_id, bill_id, user_id, food_id, rating, comment];
  await pool.query(query, values);
};

export default {
  addReview,
};
