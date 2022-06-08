////////////////////////////////
global.__basedir = __dirname; //set root directory to a global variable
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = require("./server/listener"); //listener(server)
const routers = require("./routes/router.index");
const { error, auth } = require("./middleware/middleware.index");
const path = require("path");
const { engine } = require("express-handlebars");
const getUrl = require("./middleware/getUrl");

//view setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); //directory to render files

//access static files such as css or images
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); //cross server domain activation
app.use(express.json()); //json allowed
app.use(bodyParser.urlencoded({ extended: true }));
// To parse cookies from the HTTP Request
app.use(cookieParser());

app.use(getUrl); //middleware to store url or hostname/ getting from req
routers(app); //attached routes with app
app.use(error); //middleware to catch errors
