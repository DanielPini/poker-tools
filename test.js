// var http = require('http');
// var url = require('url');
// var dt = require('./date');

// http.createServer(function (req,res) {
//   res.writeHead(200, {'Content-type': 'text/html'});
//   res.write("The date and time are currently: " + dt.myDateTime())
//   res.end();
// }).listen(8080);

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'Text/html'});
//   var q = url.parse(req.url, true).query;
//   var txt = q.year + " " + q.month;
//   console.log(q);
//   res.end(txt);
// }).listen(8080);

// var http = require('http');
var fs = require('fs');

// http.createServer(function (req, res) {
//   fs.readFile('demofile1.html', function (err, data) {
//     res.writeHead(200, {'Content-type': 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(8080);

// fs.appendFile('mynewfile1.txt', 'This is my text.', function (err) {
//   if (err) throw err;
//   console.log('Updated!');
// });

// fs.open('mynewfile2.txt', 'w', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });

// fs.unlink('mynewfile2.txt', function (err) {
//   if (err) throw err;
//   console.log('File deleted!');
// });

// fs.writeFile('mynewfile3', 'This is my text', function (err) {
//   if (err) throw err;
//   console.log('Replaced!');
// })

// fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
//   if (err) throw err;
//   console.log('File Renamed!');
// });

