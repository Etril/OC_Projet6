const express = require("express");
const booksCtrl= require("../controllers/books")
const auth= require("../middlewares/auth");
const multer= require("../middlewares/multer-config");

const router= express.Router();



router.get("/:id", booksCtrl.getBook);

router.get("/", booksCtrl.getList);

router.post("/", auth, multer, booksCtrl.postBook);


router.put("/:id", auth, booksCtrl.putBook);

router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;