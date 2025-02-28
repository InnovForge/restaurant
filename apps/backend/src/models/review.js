import { pool } from "../configs/mysql.js";

const addReview = async ({ review_id, bill_id, user_id, rating, comment }) => {
  const query = `
    INSERT INTO reviews (review_id, bill_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [review_id, bill_id, user_id, rating, comment];
  await pool.query(query, values);
};

export default {
  addReview,
};
