"use strict";

const Product = require('../models/product')

/**
 * Insert
 * @param {} req 
 * @param {*} res 
 */
async function saveProduct(req, res) {
    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description


    product.save(function(err, producStored) {
        if (err) {
            res.status(500).send({ message: `error al salvar en la base de datos: ${err}` })
            return console.error(err);
        }
        console.log(product.name + " guardado en base de datos");
        res.status(200).send({ product: producStored })
    });
}

/**
 * Get 1 document
 * @param {*} req 
 * @param {*} res 
 */
async function getProduct(req, res) {
    let productId = req.params.productId;
    Product.findById(productId, (err, products) => {
        if (err) return res.status(500).send({ message: "error en la peticion" })
        if (!products) return res.status(404).send({ message: "No se obtubieron resultados" })
        res.status(200).send({ productos: products })
    })

}

/**
 * Get 1 or more document
 * @param {*} req 
 * @param {*} res 
 */
async function getProducts(req, res) {

    Product.find({}, (err, products) => {
        if (err) return res.status(500).send({ message: "error en la peticion" })
        if (!products) return res.status(404).send({ message: "No se obtubieron resultados" })
        res.status(200).send({ productos: products })
    })
}

/**
 * Get 1 or more document with RegExp
 * @param {*} req 
 * @param {*} res 
 */
async function getProductsForName(req, res) {
    let productName = req.params.productName;
    let exp = new RegExp(productName, 'i');
    Product.find({ name: { $regex: exp } }, (err, products) => {
        if (err) return res.status(500).send({ message: "error en la peticion" })
        if (!products) return res.status(404).send({ message: "No se obtubieron resultados" })
        res.status(200).send({ productos: products })
    })
}

/**
 * Update 1 document
 * @param {*} req 
 * @param {*} res 
 */
async function updateProduct(req, res) {
    let productId = req.params.productId;
    let update = req.body;
    Product.findOneAndUpdate(productId, update, (err, proctudUpdate) => {
        if (err) {
            res.status(500).send({ message: `error al actualizar en la base de datos: ${err}` })
            return console.error(err);
        }
        console.log(update.name + " actualizado en base de datos");
        res.status(200).send({ product: proctudUpdate })
    })
}

/**
 * Delete 1 document
 * @param {*} req 
 * @param {*} res 
 */
async function deleteProduct(req, res) {
    let productId = req.params.productId;

    Product.findByIdAndRemove(productId, (err) => {
        if (err) {
            res.status(500).send({ message: `error al BORRAR en la base de datos: ${err}` })
            return console.error(err);
        }
        console.log(req.body.name + " borrado en base de datos");
        res.status(200).send({ message: "El producto ha sido eliminado" })
    })
}

module.exports = {
    saveProduct,
    getProduct,
    getProducts,
    getProductsForName,
    updateProduct,
    deleteProduct
}