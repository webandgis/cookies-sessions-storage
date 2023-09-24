// sessions.js
const express = require('express');
const router = express.Router();
const usuario = require('../models/User');
const Product=require('../models/product.model')
const { createHash, isValidatePassword } = require('../../utils');
const passport = require("passport")
const jwt = require("jsonwebtoken")


router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/profile", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("login");
    }

    const { first_name, last_name, email, age } = req.session.user;

    try {
        const productsResponse = await fetch('http://localhost:8007/api/products');
        const productsData = await productsResponse.json();

        if (productsData.status === 'success') {
            const products = productsData.payload;
            res.render("profile", { first_name, last_name, age, email, products });
        } else {
            console.error('Error fetching products:', productsData.error);
            res.status(500).send('Error fetching product data.');
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).send('Error fetching product data.');
    }
});



router.post('/register', passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Faltan datos.');
        }

        const hashedPassword = createHash(password);

        const user = await usuario.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.send({ status: "success", payload: user });
        console.log('Usuario registrado con éxito.' + user);
        res.redirect('/login');
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get("/failregister", async (req, res) => {
    try {
        console.log("Falla en autenticacion")
        res.send({ error: "Falla" })
    } catch (error) {
        console.error('Error en la ruta "/failregister":', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, productName } = req.body;
        if (!email || !password) return res.status(400).render("login", { error: "Valores erroneos" });

        const user = await usuario.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1 });

        if (!user) {
            return res.status(400).render("login", { error: "Usuario no encontrado" });
        }

        if (!isValidatePassword(user, password)) {
            return res.status(401).render("login", { error: "Error en password" });
        }

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
        };
        res.redirect("/api/sessions/profile");
    } catch (error) {
        console.error('Error en la ruta "/login":', error);
        res.status(500).send('Error interno del servidor.');
    }
});




/* router.post("/login", (req, res) => {
    const { email, password } = req.body
    if (email == "garzamora@food.com" && password == "garzapass") {
        let token = jwt.sign({ email, password }, "garzaSecret", { expiresIn: "24h" })
        res.cookie("garzaCookieToken", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({ message: "Logueado existosamente a la página de Garza Mora" })
    }
})
 */
/*
router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send("Usuario no encontrado")
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.send({ status: "success", payload: req.user })
}
) */

// Ruta para cerrar sesión
router.post("/logout", async (req, res) => {
    try {
        // Eliminar la sesión del usuario
        req.session.destroy(err => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
            }
            // Redirigir al usuario a la página de inicio de sesión
            res.redirect("/login");
        });
    } catch (error) {
        console.error('Error en la ruta "/logout":', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get("/faillogin", async (req, res) => {
    try {
        console.log("Falla en autenticacion");
        res.send({ error: "Falla" });
    } catch (error) {
        console.error('Error en la ruta "/faillogin":', error);
        res.status(500).send('Error interno del servidor.');
    }
});



module.exports = router;


