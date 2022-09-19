import express, {Router} from 'express';
import bodyParser from 'body-parser';
import { Portifolio,Auth,Uploads } from './app/controllers';
import swaggerUi from 'swagger-ui-express';
const swaggerFile = require('../swagger_output.json')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = new Router();

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/portifolio',Portifolio);
app.use('/auth',Auth);
app.use('/uploads',Uploads);

app.use(router);
console.log(`Servidor rodando no link http://localhost:${port}`);
app.listen(port);