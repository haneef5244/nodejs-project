console.log("Hello world");

const express = require('express');
const app = express();

app.get('/foo', (request, response) => response.send("Hello World"));
app.get('/bar', (request, response) => {
    const { name } = request.query;
    response.send(`Hello  ${name || 'Anonymous'}`)

})
app.listen(9000);

/*
const http = require('http');

http.createServer((request, response) => {
    console.log("Hi");
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello the world');
    response.end();
}).listen(9000);*/