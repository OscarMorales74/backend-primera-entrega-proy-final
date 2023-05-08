import multer from 'multer';
import Path from '../path.js';//saque __ a dirname
const path = Path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path + '/public/images')//saque __ a dirname
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const uploader = multer({ storage })