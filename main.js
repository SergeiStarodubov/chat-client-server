const handler = (req, res) => res.end(); //whithout it the browser cannot connect to server

const app = require('http').createServer(handler);
const readline = require('readline');
const io = require('socket.io')(app);

app.listen(3000);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  
const setHeader = (header) => {
  rl.setPrompt(header);
  rl.prompt();
}

setHeader('SERVER>');

io.on("connection", (socket) => {  
  rl.on('line', data => {
    setHeader('SERVER>');
    socket.emit('data', {data});
  }); 
  socket.on("client", (data) => {
    setHeader("CLIENT>");
    console.log(data);
    setHeader("SERVER>");
  });
});

