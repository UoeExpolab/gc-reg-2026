const https = require('https');

const options = {
  hostname: 'api.airtable.com',
  path: '/v0/meta/bases/appf8u8BhpKWEzENO/tables',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer patwZ3H9FLcpZxG2v.28f9abc5d8ab039c0948781144bf8f9c1a96938cf9f599d29d2dcc1e71f8036d'
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
