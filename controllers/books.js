const Book= require("../models/Book");

exports.getBook= (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}));
};

exports.getList= (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
  };

exports.postBook = (req, res, next) => {
    const bookObject= JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book= new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(()=> res.status(201).json({message: "Livre ajouté"}))
    .catch(error => res.status(400).json(error));
}



exports.putBook= (req, res,next) => {
    Book.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({message: "Livre modifié"}))
    .catch(error => res.status(400).json({error}));
}

exports.deleteBook= (req,res,next) => {
    Book.deleteOne ({_id: req.params.id})
    .then(() => res.status(200).json({message: "Livre supprimé"}))
    .catch(error => res.status(400).json({error}));
}





