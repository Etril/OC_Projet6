const express = require("express");
const router= express.Router();
const booksCtrl= require("../controllers/books")



router.get("/:id", booksCtrl.getBook);

router.get("/", booksCtrl.getList);

router.post("/", booksCtrl.postBook);


router.put("/:id", booksCtrl.putBook);

router.delete("/:id", booksCtrl.deleteBook);

module.exports = router;