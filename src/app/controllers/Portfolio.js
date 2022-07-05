import { Router } from "express";
// import Project from "@/app/schemas/Project";
import Project from "../schemas/Project";
import Slugify from "../../utils/Slugify";
import AuthMiddleware from '../middlewares/Auth';
import Multer from "../middlewares/Multer";

const router = new Router();

router.get('/',(req , res) => {
    Project.find().then(data => {
        const projetcs = data.map( project => {return {
            _id:project._id, 
            title: project.title, 
            category: project.category,
            slug: project.slug,
            featuredImage: project.featuredImage,
            images: project.images
        }});
        res.status(200).send(projetcs);
    }).catch( error => {
        console.error("Não foi possivel retornar do banco de dados",error);
        res.status(400).send({error: "não foi possivel obter os dados. Tente novamente"});
    })
});

router.get('/id/:projectId',(req , res) => {
    Project.findById(req.params.projectId).then(data => {
        res.status(200).send(data);
    }).catch( error => {
        console.error("não foi possivel encontrar no DB",error);
        res.status(400).send({error:"não encontrado"});
    });
});

router.get('/idAndCategory/:projectId',(req , res) => {
    // teste para ver como faz uma query
    Project.find()
        .where('category').equals(req.body.category)
        .where('_id').equals(req.params.projectId)
        .then(data => {
        res.status(200).send(data);
    }).catch( error => {
        console.error("não foi possivel encontrar no DB",error);
        res.status(400).send({error:"não encontrado"});
    })
});

router.get('/slug/:idSlug',(req, res) => {
    Project.findOne(req.params.idSlug).then( data => {
        res.status(200).send(data);
    }).catch( error => {
        console.error("não foi encontrado o slug requerido",error);
        res.status(400).send({error:"slug não encontrada"});
    })
});

/**
 * { title:str, 
 *   slug:str, 
 *   description:str, 
 *   category:str
 * }
 */
router.post('/',AuthMiddleware,(req , res) => {
    const { title, slug, description, category } = req.body;
    Project.create({ title, slug, description, category})
        .then( project => {
            res.status(200).send(project);
        })
        .catch( err => {
            console.error("erro ao salvar novo projeto no DB", err);
            res.status(400).send({ error: "Não foi possivel salvar o projeto. Verifique"});
        });
});

router.post('/featured-image/:projectId',[AuthMiddleware,Multer.single('featured-image')],(req,res) => {
    const {file} = req;
    if(file){
        Project.findByIdAndUpdate(req.params.projectId,{$set:{
            featuredImage: file.path
        }},{new: true}).then(project => {
            return res.send({project});
        }).catch(err => {
            console.error("erro ao salvar featured imagem ao projeto", err);
            return res.status(500).send({ error: "Não foi possivel salvar o projeto. Verifique"});
        });
    } else {
        return res.status(400).send({message:"nenhuma imagem enviada"});
    }
});

router.post('/images/:projectId',Multer.single('image'),(req,res) => {
    const {files} = req;
    if(files && files.length > 0){
        const images = [];
        files.forEach( file => {
            images.push(file.path);
            Project.findByIdAndUpdate(req.params.projectId,{$set:{images}},{new: true}).then(project => {
                return res.send({project});
            }).catch(err => {
                console.error("erro ao salvar featured imagem ao projeto", err);
                return res.status(500).send({ error: "Não foi possivel salvar o projeto. Verifique"});
            });
        });
    } else {
        return res.status(400).send({message:"nenhuma imagem enviada"});
    }
});

router.put('/:projectId',(req , res) => {
    const { title, description, category } = req.body;
    let slug = undefined;
    if(title && title != ""){
        slug = Slugify(title);
        Project.findByIdAndUpdate(req.params.projectId ,{ title, slug, description, category},{new:true})
            .then( project => {
                res.status(200).send(project);
            })
            .catch( err => {
                console.error("erro ao salvar novo projeto no DB", err);
                res.status(400).send({ error: "Não foi possivel salvar o projeto. Verifique"});
            });
    }else{
        res.status(400).send({erro:"titulo vazio"})
    }
});

router.delete('/:projectId',AuthMiddleware,(req , res) => {
    Project.findByIdAndDelete(req.params.projectId).then(() => {
        res.status(200).send({message:"projeto deletado com sucesso"})
    }).catch(error => {
        console.error("erro ao deletar",error);
        res.status(400).send({erro:"erro ao deletar o projeto"});
    })
});

export default router;