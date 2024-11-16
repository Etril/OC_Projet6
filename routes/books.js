const express = require("express");
const router= express.Router();
const booksCtrl= require("../controllers/books")

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

router.get("/:id", booksCtrl.getBook);

router.get("/", booksCtrl.getList);

router.post("/", booksCtrl.postBook);


router.put("/:id", booksCtrl.putBook);

router.delete("/:id", booksCtrl.deleteBook);

module.exports = router;