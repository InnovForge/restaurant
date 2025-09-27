import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    infileStreamFactory: (filePath) => fs.createReadStream(filePath),
    localInfile: true,
  });

  const [rows] = await conn.query("SHOW VARIABLES LIKE 'local_infile'");
  if (!rows.length || rows[0].Value !== "ON") {
    console.error("❌ local_infile is OFF. Enable it on MySQL server and restart.");
    process.exit(1);
  }
  console.log("✅ local_infile is ON");

  const dataDir = path.join(process.cwd(), "data");
  const tables = [
    "users",
    "addresses",
    "user_addresses",
    "restaurants",
    "restaurant_managers",
    "restaurant_schedules",
    "food_categories",
    "foods",
    "food_category_mapping",
    "tables",
    "reservations",
    "bills",
    "bill_items",
    "search_history",
  ];

  for (const table of tables) {
    const filePath = path.join(dataDir, `${table}.csv`);
    if (!fs.existsSync(filePath)) {
      console.warn(`!  CSV not found: ${filePath}, skipping.`);
      continue;
    }

    console.log(`⏳ Importing ${table}...`);

    try {
      await conn.query("SET autocommit=0, unique_checks=0, foreign_key_checks=0");

      await conn.query(
        `
  LOAD DATA LOCAL INFILE ?
  INTO TABLE ${table}
  CHARACTER SET utf8mb4
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES
  `,
        [filePath],
      );

      const [warnings] = await conn.query("SHOW WARNINGS");
      if (warnings.length) {
        console.warn(`! Warnings for table ${table}:`, warnings);
      }
      await conn.query("COMMIT");
      await conn.query("SET autocommit=1, unique_checks=1, foreign_key_checks=1");
      console.log(`✅ Imported ${table}`);
    } catch (err) {
      console.error(`❌ Import failed for table ${table}:`, err);
    }
  }

  await conn.end();
  console.log("🎉 All CSV import attempt finished!");
}

main().catch((err) => {
  console.error("❌ Import failed:", err);
});
