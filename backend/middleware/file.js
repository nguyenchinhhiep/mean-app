const multer = require('multer');
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let err = new Error('Invalid mime type');
        if(isValid) {
            err = null;
        }
        cb(err, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, `${name}-${Date.now()}.${ext}`)
    }
});

module.exports = multer({storage: storage}).single('image');
