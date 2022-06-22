import { Router } from "express";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import User from "../schemas/User"
import authConfig from "../../config/Auth";
import Mailer from "../../modules/Mailer";

const router = new Router();
//token valido por um dia
const generateToken = params => {
    return jwt.sign(
        params,
        authConfig.secret,
        {
            expiresIn: 86400
        }
    )
}

router.post('/register',(req,res) => {
    const {name,email,password} = req.body;
    User.findOne({email}).then(userData => {
        if (userData) {
            res.status(400).send({error:"Usuario ja cadastrado"});
        } else {
            User.create({name,email,password}).then( user => {
                // existe alguma forma de ja ao enviar ser formatado para não aparecer a senha?
                // user.password = undefined;
                return res.status(200).send({user});
            }).catch( error => {
                console.error("erro ao inserir novo registro de usuario",error);
                return res.status(400).send({error:"Erro ao inserir usuario"});
            });
        }
    }).catch( error => {
        console.error("erro ao consultar usuario no banco de dados", error);
        res.status(500).send({error:"Erro ao registrar"});
    })
});

router.post('/login',(req,res) => {
    const {email,password} = req.body;
    User.findOne({email})
    .select('+password')
    .then(user => {
        if(user){
            bcrypt.compare(password,user.password).then( result => {
                if(result){
                    // user.password = undefined;
                    // return res.send({user});
                    const token = generateToken({uid:user._id});
                    return res.send({token:token,tokenExpiration:'1d'});
                } else {
                    // return res.status(401).send({error:"Invalide password"})
                    return res.sendStatus(401);
                }
            }).catch(error => {
                console.error("erro ao verificar senha de usuario",error);
                return res.status(500).send({error:"Internal server error"})
            })
        } else {
            return res.status(404).send({error:"user not found"});
        }
    }).catch( error => {
        console.error("erro ao logar",error);
        res.status(500).send({error:"internal erro"});
    })
});

router.post('/forgot-password',(req,res) => {
    const {email} = req.body;
    User.findOne({email})
    .then(user => {
        if(user){
            const token = crypto.randomBytes(20).toString('hex');
            const expirationToken = new Date();
            expirationToken.setHours(new Date().getHours() + 3);
            User.findByIdAndUpdate(user._id,{
                $set: {
                    passwordResetToken: token,
                    passwordResetTokenExpiration: expirationToken
                }
            }).then(() => {
                Mailer.sendMail({
                    to: user.email,
                    from: "webmaster@teste.com",
                    template: 'auth/forgot_password',
                    context: {token}
                }, err => {
                    if(err){
                        console.error('erro ao enviar email');
                        return res.status(400).send("erro fail sending recover password mail");
                    }else {
                        return res.sendStatus(200);
                    }
                });
            }).catch(error => {
                console.error('erro ao salvar o token de recuperação de senha',error);
                return res.status(500).send({error:"internal erro"});
            });
        } else {
            return res.status(404).send({error:"user not found"});
        }
    }).catch( error => {
        console.error("erro ao passo forgot password",error);
        res.status(500).send({error:"internal erro"});
    })
});

router.post('/reset-password',(req,res) => {
    const { email, token, newPassword} = req.body;

    User.findOne({email})
        .select('+passwordResetToken passwordResetTokenExpiration').then( user => {
            if(user){
                if(token != user.passwordResetToken || new Date().now() > user.passwordResetTokenExpiration) {
                    return res.status(400).send({error:"Invalid token"});
                } else {
                    user.passwordResetToken = undefined;
                    user.passwordResetTokenExpiration = undefined;
                    user.password = newPassword;
                    user.save().then(() => {
                        return res.send({message:"ok"});
                    }).catch(error => {
                        console.error("erro ao salvar a senha do usuario no reset",error);
                        return res.status(500).send({message:"Internal error"});
                    });
                }
            } else {
                return res.status(404).send({error:"user not found"});
            }
    }).catch( error => {
        console.error("erro ao passo reset password",error);
        res.status(500).send({error:"internal erro"});
    })
});

export default router;