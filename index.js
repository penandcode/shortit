const express = require('express');
const mongoose = require("mongoose");
const config = require("./src/config/config");
const cors = require("cors");
const routes = require('./src/routes/index');
const { errorHandler } = require('./src/middlewares/error');
const ApiError = require('./src/utils/ApiError');
const { status } = require('http-status');
const passport = require('passport');
const session = require('express-session');
const passportStrategy = require("./src/utils/passport")
const app = express()

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/utils/swagger");

app.use(cors());
app.options("*", cors());

app.use(
  session({
    secret: 'strongpassword',
    resave: false,
    saveUninitialized: true,
  })
);

app.disable('x-powered-by')

app.use(passport.initialize());

passport.use("google", passportStrategy);

app.use(passport.session());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

mongoose.connect(config.mongoose.url).then(() => {
  console.log('Connected to DB.');

  app.listen(config.port, () => {
    console.log('Listening to PORT:', config.port);
  })
})

app.use("/api", routes)

app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, "Not found"));
});

app.use(errorHandler);
