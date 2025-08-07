const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/transactions/');
  },
  filename: (req, file, cb) => {
    const { transaction_id } = req.body;
    const ext = path.extname(file.originalname);
    cb(null, `txn-${transaction_id}${ext}`);
  }
});

module.exports = multer({ storage });
