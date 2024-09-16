  const express = require("express");
  const cors = require("cors");
  const morgan = require("morgan");
  const cookieParser = require('cookie-parser');
  const fs = require('fs');
  const http = require('http');
  const socketIo = require('socket.io');

  const setupSocketHandlers = require('./handlers/socketHandler.js');
  const setuoChatHandler = require('./handlers/chat.js')
  const connectDB = require('./db.js');

  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  connectDB();
  
  setupSocketHandlers(io);
  setuoChatHandler(io);

  fs.readdir("./routes", (err, files) => {
    files.forEach(file => {
    app.use("/", require("./routes/" + file))
    });
  });

  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
  };
  
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use('/uploads', express.static('uploads'));
  app.use(morgan("common"));
  server.listen(5137, () => {
    // console.log("Бэк ворк на http://localhost:5137");
  });
