const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODcyMjQxM2JkYjA5NjEzNDJjZDU2OTkiLCJpYXQiOjE3NTIzMTExMjEsImV4cCI6MTc1MjkxNTkyMX0.HqfjkxFZ4ZEQaLT3PjXbYTEKTJVOpgDghS2aYrgC-Lg';

const postData = JSON.stringify({
  name: 'nodejs',
  description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine.'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/tags',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
