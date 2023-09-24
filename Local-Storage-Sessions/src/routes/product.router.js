const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();


//Endpoint GET


// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: 'success', payload: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ status: 'error', error: 'Error fetching products' });
  }
});


//Endpoint POST

router.post("/", async (req, res) => {
    try {
        let { name, category, price, stock, image } = req.body;
        if (!name || !category || !price || !stock || !image) {
            res.status(400).send("Faltan o hay algún error en los parametros añadidos");
        } else {
            let result = await Product.create({ name, category, price, stock, image });
            res.send({ result: "success", payload: result });
        }
    } catch (error) {
        console.error("Error al añadir producto");
    }
});

//Endpoint Put

router.put("/:uid", async (req, res) => {
    try {

        let { uid } = req.params
        let productReplace = req.body
        if (!productReplace.name || !productReplace.category || !productReplace.price || !productReplace.stock || !productReplace.image) {
            res.send({ result: "error", error: "le faltan parametros al producto" })
        }
        let result = await Product.updateOne({ _id: uid }, productReplace)
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.error("Error al añadir producto");
    }
})

//Endpoint Delete

router.delete("/uid", async (req, res) => {
    let { uid } = req.params

    try{
        let result = await Product.deleteOne({ _id: uid })
        res.send({result:"success",payload:result})

    }catch(error){
        console.error("Error al añadir producto");
    }
})



module.exports = router
