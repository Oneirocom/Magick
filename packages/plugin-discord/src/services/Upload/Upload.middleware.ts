import multer from 'multer'

const mulitPartMiddleware = multer()
export const singleFileMulti = mulitPartMiddleware.array("files")
export const uploadMiddleWare = (req, res, next) => {
    req.feathers.files = req.files
    next();
}