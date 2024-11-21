const fs = require("fs");
const Book = require("../models/Book");

/*** Cette route permet de récupérer une array de l'ensemble des livres avec leurs informations */

exports.getList = (req, res, next) => {
  Book.find({})
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

/*** Cette route permet de récupérer les informations du livre choisi sur la page d'accueil */

exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

/*** Cette route permet de publier un nouveau livre */

exports.postBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre ajouté" }))
    .catch((error) => res.status(400).json(error));
};

/*** Cette route permet de modifier un livre existant, en modifiant ou non l'image */

exports.putBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        if (req.file) {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Book.updateOne(
              { _id: req.params.id },
              { ...bookObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Livre modifié!" }))
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Livre modifié!" }))
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*** Cette route permet de supprimer un livre existant */

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/*** Cette route permet de noter un livre et de mettre à jour la note moyenne */

exports.rateBook = (req, res, next) => {
  Book.find({ _id: req.params.id, 'ratings.userId': req.auth.userId })
    .then((result) => {
      console.log(result)
      if (result.length != 0) {
        res.status(403).json({ message: "Unauthorized request" });
        return;
      }
      Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $addToSet: {
            ratings: { userId: req.auth.userId, grade: req.body.rating },
          },
        }
      )
        .then((book) => {
          updateRating(book)
            .then((book) => res.status(201).json(book))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({error}))
    })
    .catch((error) => res.status(400).json({ error }));
};

/*** Cette route permet de filtrer les 3 livres les mieux notés */

exports.getBestRating = (req, res, next) => {
  Book.find({})
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

/*** Cette fonction est utilisée pour mettre à jour la note moyenne */

function updateRating(book) {
  let sum = 0;
  for (let i = 0; i < book.ratings.length; i++) {
    sum += book.ratings[i].grade;
  }
  const update = sum / book.ratings.length;
  return Book.findOneAndUpdate(
    { _id: book.id },
    { averageRating: update },
    { returnDocument: "after" }
  );
}

function checkDoublon(bookChoice) {
  return bookChoice.find((a) => a.ratings.userId === req.auth.userId);
}
