const Airtable = require('airtable');

const base = new Airtable({ apiKey: "patwZ3H9FLcpZxG2v.28f9abc5d8ab039c0948781144bf8f9c1a96938cf9f599d29d2dcc1e71f8036d" }).base("appf8u8BhpKWEzENO");

async function checkTable(tableName) {
  try {
    console.log(`\n--- Checking table: ${tableName} ---`);
    const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
    if (records.length === 0) {
      console.log(`Table '${tableName}' is empty or not found (if it doesn't error).`);
    } else {
      console.log(`Found record in '${tableName}'. Fields:`, Object.keys(records[0].fields));
      console.log(`Sample data:`, JSON.stringify(records[0].fields, null, 2));
    }
  } catch (error) {
    console.error(`Error accessing table '${tableName}':`, error.message);
  }
}

async function run() {
  await checkTable('Inventory');
  await checkTable('Time Slots');
  await checkTable('Inventory Reservations');
  await checkTable('Students');
}

run();
