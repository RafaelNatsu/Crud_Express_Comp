import mongoose from "../../database/index";
import bcrypt, { hash } from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetTokenExpiration: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save',function (next) {
    bcrypt.hash(this.password,10).then(hash => {
        this.password = hash;
        next();
    }).catch(error =>{
        console.error("erro ao salvar/criptografar a senha",error);
    });
})

export default mongoose.model('User',UserSchema);