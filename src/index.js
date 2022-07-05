import express, {Router} from 'express';
import bodyParser from 'body-parser';
import { Portifolio,Auth,Uploads } from './app/controllers';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = new Router();

app.use('/portifolio',Portifolio);
app.use('/auth',Auth);
app.use('/uploads',Uploads);

app.use(router);
console.log(`Servidor rodando no link http://localhost:${port}`);
app.listen(port);