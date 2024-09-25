import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const multerStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
})

const multerFilter = (req, file, cb) =>{
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }else{
        cb({
            message: "Unsupported file format"
        },
        false
        )
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 },
});

// const productImgResize = async (req, res, next) => {
//     if(!req.files){
//         return next();
//     }
//     await Promise.all(req.files.map(async (file) => {
//         await sharp(file.path)
//         .resize(300,300)
//         .toFormat('jpeg')
//         .jpeg({quality:90})
//         .toFile(`public/images/products/${file.filename}`);

//         fs.unlinkSync(`public/images/products/${file.filename}`);
    
//     }));
//     next();
// };

// Image resize middleware with safe path handling
const productImgResize = async (req, res, next) => {
    if (!req.files) {
        return next();
    }

    await Promise.all(req.files.map(async (file) => {
        // Sanitize filename and ensure it's just the filename without path traversal
        const sanitizedFilename = path.basename(file.filename);
        const uploadsDir = path.resolve(path.join(__dirname, '../public/images/products'));
        const safeOutputPath = path.join(uploadsDir, sanitizedFilename);

        // Ensure the final path is within the intended directory
        if (safeOutputPath.startsWith(uploadsDir)) {
            // Resize and save the image using sharp
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(safeOutputPath);

            // Safely delete the original file only if it's within the allowed directory
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Failed to delete original file: ${file.path}`, err);
                }
            });
        } else {
            throw new Error('Attempted path traversal detected.');
        }
    }));

    next();
};

export default {
    uploadPhoto,
    productImgResize,
};