const https = require('https');

const options = {
  hostname: 'api.airtable.com',
  path: `/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      parsed.tables.forEach(table => {
        console.log(`\nTable: ${table.name}`);
        table.fields.forEach(field => {
          if (field.type === 'multipleRecordLinks') {
             console.log(`  - ${field.name} (Links to: ${field.options.linkedTableId})`);
          } else {
             console.log(`  - ${field.name} (${field.type})`);
          }
        });
      });
    } else {
      console.log(`Error: ${res.statusCode}`);
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
