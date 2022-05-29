const express = require("express");
const cors = require("cors");
const app = require("./server/listener"); //listener
const routers = require("./routes/router.index");
const middlewares = require("./middleware/middleware.index");
//cross server domain activation
app.use(cors());
//json allowed
app.use(express.json());

//attached routes with app
routers(app);

//middleware to catch errors
app.use(middlewares.error); //to get error
