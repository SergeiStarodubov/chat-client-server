const handler = (req, res) => res.end();

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

setHeader('Admin>');
 
let bd = [];
let history = [];

io.on("connection", (socket) => {  
  
  rl.on('line', text => {
    setHeader('Admin>');
    history.push({name: "Admin>", message: text})
    socket.emit('data', {name: "Admin>", message: text});
  });

  socket.on("client", (data) => {
    socket.emit("data", {name: data.name, message: data.message})
    for (let user of bd) {
      if (user.name === data.name) {
        user.messages.push(data.message);
        history.push({name: user.name, message: data.message} )
      }
    }
    setHeader("Admin>");
  });


  socket.on("register", (clientName) => {
    let client = {name: clientName, messages: []};
    bd.push(client);
  });

  socket.emit("history", history);
});

