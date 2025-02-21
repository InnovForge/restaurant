import mysql from "mysql2/promise";
import readline from "readline";

const clearDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
    });

    await connection.execute("SET FOREIGN_KEY_CHECKS = 0;");

    const [tables] = await connection.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.MYSQL_DATABASE],
    );

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      await connection.query(`TRUNCATE TABLE \`${tableName}\`;`);
      console.log("✅ deleted all data in table", tableName);
    }

    await connection.execute("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("✅ deleted all data in database");
    await connection.end();
  } catch (error) {
    console.error("❌ error when delete", error);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const icons = [
//   "✅", "⚠️", "❌", "🔴", "🟢", "🟡", "🔵", "🔶", "🔷", "⬜", "⬛",
//   "⭐", "🌟", "💡", "🔥", "⚡", "🔔", "🔕", "📢", "📣", "📌", "📍",
//   "🔒", "🔓", "🔑", "✉️", "📧", "📨", "📤", "📥", "🗑️", "🖊️",
//   "📅", "📆", "⏰", "⏳", "📊", "📈", "📉", "⚙️", "🧲", "🔧", "🔨",
//   "🧩", "🔗", "🖇️", "📎", "🔍", "🔎", "🛠️", "🧰", "🛡️", "🚀", "🧹"
// ];
//
// icons.forEach(icon => console.log(icon));

const start = () => {
  if (process.argv.includes("-y")) {
    console.log("🚀 Đang xóa dữ liệu...");
    clearDatabase().finally(() => rl.close());
  } else {
    rl.question("📣 Xóa toàn bộ dữ liệu trong database? (y/N): ", (answer) => {
      if (answer.toLowerCase() === "y") {
        console.log("🚀 Đang xóa dữ liệu...");
        clearDatabase().finally(() => rl.close());
      } else {
        console.log("❌ Đã hủy.");
        rl.close();
      }
    });
  }
};

start();
