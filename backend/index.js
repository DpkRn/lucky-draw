
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const locationRoutes = require('./routes/locationRoutes');
const ipLocationManually=require('./router/locationRoutes')
app.use('/api', locationRoutes);


const server = http.createServer(app);
const setupWebSocket = require('./websocket');
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
