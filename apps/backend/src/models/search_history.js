import { pool } from "../configs/mysql.js";
import { removeDiacritics } from "../utils/removeDiacritics.js";

const SearchHistoryModel = {
  async saveSearchHistory(userId, query) {
    const normalizedQuery = removeDiacritics(query);
    const [rs] = await pool.query(
      `INSERT INTO search_history (user_id, search_query, search_query_normalized) 
     VALUES (?, ?, ?) 
     ON DUPLICATE KEY UPDATE created_at = NOW()`,
      [userId, query, normalizedQuery],
    );

    return rs.affectedRows > 0;
  },
  async getSearchHistory(userId) {
    const [searchHistory] = await pool.query(
      "SELECT id, search_query FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [userId],
    );

    if (!searchHistory || searchHistory.length === 0) {
      return [];
    }

    return searchHistory.map((item) => ({
      type: "history",
      id: item.id,
      query: item.search_query,
    }));
  },

  async deleteSearchHistory(userId, id) {
    const [rs] = await pool.query("DELETE FROM search_history WHERE user_id = ? AND id = ?", [userId, id]);
    return rs.affectedRows > 0;
  },
  async suggestSearchHistory(query) {
    if (!query || typeof query !== "string") return [];

    const normalizedQuery = removeDiacritics(query.trim().toLowerCase());

    if (normalizedQuery.length > 3) {
      const [results] = await pool.query(
        `SELECT 
          ANY_VALUE(id) AS id, 
          search_query 
       FROM search_history 
       WHERE MATCH(search_query_normalized) AGAINST(? IN NATURAL LANGUAGE MODE) 
       GROUP BY search_query 
       ORDER BY MAX(created_at) DESC 
       LIMIT 5`,
        [normalizedQuery],
      );
      return results.map((item) => ({
        type: "suggestion",
        id: item.id,
        query: item.search_query,
      }));
    } else {
      const [results] = await pool.query(
        `SELECT 
          ANY_VALUE(id) AS id, 
          search_query 
       FROM search_history 
       WHERE search_query_normalized LIKE ? 
       GROUP BY search_query 
       ORDER BY MAX(created_at) DESC 
       LIMIT 5`,
        [`${normalizedQuery}%`],
      );
      return results.map((item) => ({
        type: "suggestion",
        id: item.id,
        query: item.search_query,
      }));
    }
  },
};

export default SearchHistoryModel;
