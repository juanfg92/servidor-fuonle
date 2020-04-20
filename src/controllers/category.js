'use strict'

const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const path = require("path");
const fs = require("fs");
var rimraf = require("rimraf");

/**
 * new category
 * @param {*} req 
 * @param {*} res 
 */
async function newCategory(req, res) {
    // Check empty camps
    if (req.body.categoryName == null ||
        req.body.categoryName == "" ||
        req.body.studyLevelId == null ||
        req.body.studyLevelId == "") {
        return res.status(500).send({ message: `Error creating the category: empty camps` })
    }

    // categoryName validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 -\x41\x42ñÑü.]{2,60}$/.test(req.body.categoryName))) return res.status(400).send({ message: `the category name must be between 2 and 60 characters, not contain spaces and empy start with a letter` });

    // Check duplication category
    try {
        let categoryFound = await Category.findOne({ categoryName: req.body.categoryName, _id_studyLevel: req.body.studyLevelId });
        if (categoryFound) {
            return res.status(400).send({ message: `the category name: ${req.body.categoryName} is already registered` });
        }
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }

    // Save category
    let category = new Category({
        categoryName: req.body.categoryName,
        _id_studyLevel: req.body.studyLevelId
    })

    category.save((err, category) => {
        if (err) res.status(500).send({ message: `Error creating category: ${err}` })

        //create category folder
        let folder = path.resolve(__dirname + "/../../public_document/" + req.body.studyLevelId + "/" + category._id);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        return res.status(200).send({ Category: category });
    })
}

/**
 * get all categories by studyLevelId
 * @param {*} req 
 * @param {*} res 
 */
async function getCategoriesByStudyLevel(req, res) {
    Category.find({ _id_studyLevel: req.body.studyLevelId }, (err, categories) => {
        if (err) return res.status(500).send({ message: `Error server: ${err}` })
        if (categories.length == 0) return res.status(404).send({ message: `no results have been obtained` })
        res.status(200).send({ Categories: categories })
    })
}

/**
 * delete category and all subcategories contained
 * @param {*} req 
 * @param {*} res 
 */
function deleteCategory(req, res) {
    let categoryId = req.body.categoryId;
    Category.findByIdAndRemove(categoryId, (err) => {
        if (err) {
            res.status(500).send({ message: `Error server: ${err}` })
        }
        //remove all subcategories contained in this category
        Subcategory.deleteMany({ _id_category: categoryId }, (err) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
        })

        //remove all containers from the category
        let pathFile = path.resolve(__dirname + "/../../public_document/" + req.body.studyLevelId + "/" + req.body.categoryId)
        rimraf.sync(pathFile);

        res.status(200).send({ message: `category ${categoryId} has been deleted` })
    })
}

/**
 * update category, no case sensitive
 * @param {*} req 
 * @param {*} res 
 */
async function updateCategory(req, res) {
    let update = req.body;

    // Check empty camps
    if (req.body.categoryName == null ||
        req.body.categoryName == "" ||
        req.body.categoryId == null ||
        req.body.categoryId == "" ||
        req.body.studyLevelId == null ||
        req.body.studyLevelId == "") {
        return res.status(500).send({ message: `Error updating the category: empty camps` })
    }

    // categoryName validation 
    if (!(/^[A-Za-zÁÉÍÓÚáéíóúñÑü][A-Za-zÁÉÍÓÚáéíóú0-9 -\x41\x42ñÑü.]{2,60}$/.test(req.body.categoryName))) return res.status(400).send({ message: `the category name must be between 2 and 60 characters, not contain spaces and empy start with a letter` });

    // Check duplication category
    try {
        let categoryFound = await Category.findOne({ categoryName: req.body.categoryName, _id_studyLevel: req.body.studyLevelId });
        if (categoryFound) {
            return res.status(400).send({ message: `the category name: ${req.body.categoryName} is already registered` });
        }

        Category.findOneAndUpdate({ _id: req.body.categoryId }, update, (err, category) => {
            if (err) {
                res.status(500).send({ message: `Error server: ${err}` })
            }
            res.status(200).send({ Category: category })
        })
    } catch (err) {
        return res.status(500).send({ message: `Error server: ${err}` });
    }
}

module.exports = {
    newCategory,
    getCategoriesByStudyLevel,
    deleteCategory,
    updateCategory
}