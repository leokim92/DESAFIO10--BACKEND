const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require ("./routes/carts.router.js")
const sessionsRouter = require("./routes/sessions.router.js")
const PORT = 8080;
const viewsRouter = require("./routes/views.router.js");

//Socket IO
const socket = require("socket.io");

//Session
const session = require("express-session");

//Mongo-Connect
const MongoStore = require("connect-mongo");

//File-Store
const FileStore = require ("session-file-store");
const fileStore = FileStore(session);

//Passport
const passport = require ("passport")
const initializePassport = require ("./config/passport.config.js")

//import MongoDB
require ("./database.js");

//Express-Handlebars
const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("./src/public"));

//Middleware de session
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    //Mongo Store
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://leonardokim92:coderhouse@cluster0.2ca8jnw.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Cambios con Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

//Socket IO & CHAT
const httpServer = app.listen(PORT, () => {
    console.log(`Listening in PORT ${PORT}`);
})

const MessageModel = require("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection", (socket) => {
    console.log("A client had connected");

    socket.on("message", async (data) => {
        
        await MessageModel.create(data);

        const messages = await MessageModel.find();
        io.sockets.emit("message", messages)  
    })
} )
