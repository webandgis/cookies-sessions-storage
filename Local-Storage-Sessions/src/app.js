const express = require('express');
const mongoose = require('mongoose');
const path=require('path')
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const usersRouter = require('./routes/users.router.js');
const productRouter = require('./routes/product.router.js')
const passport = require("passport")
const initializePassport = require("./config/passport.config");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8007


const handlebarsOptions = {
    allowProtoMethodsByDefault: true, //
};




mongoose.connect('mongodb+srv://girmar14:d1CYrI8pl75TyQw5@e-commerce.s0glbx3.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://girmar14:d1CYrI8pl75TyQw5@e-commerce.s0glbx3.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600,
    }),
    secret: 'garzaSecret',
    resave: false,
    saveUninitialized: true,
}));

initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use('/api/sessions', usersRouter)
app.use("/api/products", productRouter)


app.get('/', (req, res) => {
    res.send('Express Sessions!')
})
app.get('/login', (req, res) => {
    res.render('login');
});
/* app.get('/products', (req, res) => {

    res.render('product-container', contextData);
}); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT} `);
});