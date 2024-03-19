const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'backend/public/img')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));


    }

   
});
 module.exports = diskStorage;