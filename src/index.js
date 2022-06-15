import express, {Router} from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = new Router();

router.get('/',(req,res) => {
    return res.status(200).send({ message:'Hello World!' });
});
/**
 * {
 *      "name":string
 * }
 */
router.post('/', (req,res) => {
    return res.status(200).send({message:`ola ${req.body.name}`});
});

app.use(router);
console.log(`Servidor rodando no link http://localhost:${port}`);
app.listen(port);