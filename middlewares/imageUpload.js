const multer = require("multer");
const path = require("path");

// Destino onde vai ser armazenada a image
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {

    let folder = "";

    if (req.baseUrl.includes('uploads')) {
      folder = "uploads";
    }
    cb(null, `uploads${folder}/`);

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
