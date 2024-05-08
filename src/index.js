const express = require('express');
const rateLimit = require('express-rate-limit');

const { createProxyMiddleware } = require('http-proxy-middleware')

const {ServerConfig} = require('./config');
const apiRoutes = require('./routes');

const limiter = rateLimit({
  windowMs: 2*60*100, // 2 minutes : window-time to reset
  max: 3 // limits each ip to 3 requests
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use('/flightService', createProxyMiddleware({target: ServerConfig.FLIGHT_SERVICE, changeOrigin:true}))
app.use('/bookingService', createProxyMiddleware({target: ServerConfig.BOOKING_SERVICE, changeOrigin:true}))

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server successfully started on port : ${ServerConfig.PORT}`);
});

 