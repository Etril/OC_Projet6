const multer = require("multer");
const SharpMulter = require("sharp-multer");

const newFilenameFunction = (og_filename, options) => {
  const newname =
    og_filename.split(".").slice(0, -1).join(".") +
    `${ "-" + Date.now()}` +
    "." +
    options.fileFormat;
  return newname;
};

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "images"),

  imageOptions: {
    fileFormat: "webp",
    quality: 80, 
    resize: { width: 600, height: 600, resizeMode: "cover", withoutEnlargement: true },
  },

  filename: newFilenameFunction,
});

module.exports = multer({ storage }).single("image");
