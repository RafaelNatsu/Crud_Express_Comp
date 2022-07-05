import multer from 'multer';
import Slugify from 'slugify';
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./uploads/images");
    },
    filename: (req,file,cb) => {
        const lastDot = file.originalname.lastIndexOf('.');
        const filename = file.originalname.slice(0,lastDot);
        const extension = file.originalname.slice(lastDot+1,file.originalname.length);
        cb(null,`${Slugify(filename)}.${extension}`); 
    }
})

export default multer({storage});