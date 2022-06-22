import jwt from 'jsonwebtoken';
import autConfig from '../../config/Auth';

export default (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const tokenDate = authHeader.split(' ');
        if(tokenDate.length !== 2) {
            return res.status(401).send({error:"no valid token provided"});
        }

        const [schema,token] = tokenDate;
        if(schema.indexOf('Bearer') < 0){
            return res.status(401).send({error:"no valid token provided"});
        }

        jwt.verify(token,autConfig.secret,(err,decoded) => {
            if(err){
                return res.status(401).send({error:"no valid token provided"});
            } else {
                req.uid = decoded.uid;
                return next();
            }
        })
    } else {
        return res.status(401).send({error:"no valid token provided"});
    }
}