import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit for file
    fields: 10, // Maximum number of non-file fields
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 50 * 1024 * 1024, // Maximum field value size (50MB for base64 face image)
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})
