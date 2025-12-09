import { Router } from "express";
import multer from "multer";

const modelCallRoutes = Router();
const upload = multer({ dest : "uploads/" })

modelCallRoutes.post('/upload', upload.single("image"), (req,res)=>{
    console.log(req.file);

    res.json({
        path : req.file?.path
    })
})

export default modelCallRoutes;