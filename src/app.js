const express = require('express');
const session = require("express-session")
const handlebars = require("express-handlebars")
const sessionRouter = require("./routes/sessions")
const viewsRouter = require("./routes/views")
const MongoStore = require("connect-mongo")

const PORT= 8005;
const app = express();

app.use(express.urlencoded({ extended: true }))

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://girmar14:d1CYrI8pl75TyQw5@e-commerce.s0glbx3.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        path:'./sessions',
        ttl: 1000
    }),
    secret: "garzamora",
    resave: false,
    saveUninitialized: true
}))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "views")
app.set("view engine", "handlebars")


app.use("/api/sessions", sessionRouter)
app.use("/", viewsRouter)


app.listen(PORT,() => console.log(`Server running from: ${PORT}`));