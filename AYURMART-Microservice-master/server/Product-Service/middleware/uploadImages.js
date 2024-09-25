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

            // Resolve and validate the original file path before deletion
            const originalFilePath = path.resolve(file.path);
            if (originalFilePath.startsWith(path.resolve(path.join(__dirname, '../public/images')))) {
                // Safely delete the original file
                fs.unlink(originalFilePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete original file: ${originalFilePath}`, err);
                    }
                });
            } else {
                throw new Error('Invalid file path detected, preventing path traversal.');
            }
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