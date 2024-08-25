const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save-score') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        // Parse the JSON data from the request body
        const data = JSON.parse(body);

        if (!data.username || !data.score || typeof data.score !== 'number') {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid score data');
          return;
        }

        // Create a timestamp for the score
        const timestamp = new Date().toISOString();

        // Construct the score entry
        const scoreEntry = `${timestamp} - ${data.username}: ${data.score}\n`;

        // Define the path to the scores.txt file
        const scoresFilePath = path.join(__dirname, 'scores.txt');

        // Append the score to the scores.txt file
        fs.appendFile(scoresFilePath, scoreEntry, (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Score saved successfully');
          }
        });
      } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON data');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
