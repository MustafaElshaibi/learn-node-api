const multer = require('multer');
const errorHelper = require('./errorHelper');

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb)=> {
    const ext = file.mimetype.split('/')[1];
    const filename = `${file.originalname.split(' ').join('-').split('.')[0]}-${Date.now()}.${ext}`;
    cb(null, filename);
  }
})

const fileFilter = (req, file, cb)=> {
  if(file.mimetype.split('/')[0] === "image") {
   return cb(null, true);
  } else {
   return cb(errorHelper.create('only images are allowed', 400, 'error'), false);
  }
}

const uploade = multer({ storage: storage, fileFilter})

module.exports  = uploade;