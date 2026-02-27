const express = require('express');
const router = express.Router();
const contacts = require("../controllers/contact.controller");


// GET tất cả & POST & DELETE ALL
router.route("/")
    .get(contacts.findAll)
    .post(contacts.create)
    .delete(contacts.deleteAll);
// Route cụ thể phải đặt trước /:id
router.route("/favorite")
    .get(contacts.findAllFavorite);
// Route theo ID
router.route("/:id")
    .get(contacts.findOne)
    .put(contacts.update)
    .delete(contacts.delete);

module.exports = router;