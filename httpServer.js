import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('HTTP Server is running');
});

