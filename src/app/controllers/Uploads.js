import { Router } from "express";
import fs from 'fs';
import path from 'path';

const router = new Router();

router.get('/images/:filename', (req,res) => {
    const filePath = path.resolve(`./uploads/images/${req.params.filename}`);
    // const exists = fs.existsSync(filePath);
    // if(exists){
    //     return res.sendFile(filePath);
    // }else {
    //     return res.senStatus(404);
    // }
    fs.exists(filePath,exists => {
        if(exists){
            return res.sendFile(filePath);
        } else {
            return res.senStatus(404);
        }
    });
});

export default router;