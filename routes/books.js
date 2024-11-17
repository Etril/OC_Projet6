const express = require("express");
const booksCtrl= require("../controllers/books")
const auth= require("../middlewares/auth");
const multer= require("../middlewares/multer-config");

const router= express.Router();



router.get("/:id", booksCtrl.getBook);

router.get("/", booksCtrl.getList);

router.post("/", auth, multer, booksCtrl.postBook);

router.post("/:id/rating", auth, booksCtrl.rateBook);

router.put("/:id", auth, multer, booksCtrl.putBook);

router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;