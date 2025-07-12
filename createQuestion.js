const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODcyMjNmOGJkYjA5NjEzNDJjZDU2OTYiLCJpYXQiOjE3NTIzMTE0NDcsImV4cCI6MTc1MjkxNjI0N30.mAlsKTPF5tA3uYxKnMZXeVr-I2doDb7pOp4CDK2zmL8';

const postData = JSON.stringify({
  title: 'How to create a REST API with Node.js and Express?',
  description: 'I am new to Node.js and I want to create a simple REST API for a blog application. What are the basic steps to get started?',
  tags: ['68722581d9b4425587ce09558', '687225f0d9b425587ce09560']
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/questions',
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
