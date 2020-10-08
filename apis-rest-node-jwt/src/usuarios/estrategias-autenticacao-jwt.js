const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const Usuario = require('./usuarios-modelo');
const fwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const {InvalidArgumentError} = require('../erros');

const {ExpirationError} = require('../erros');

function verificarUsuario(usuario){

    if(!usuario){
        throw new InvalidArgumentError('Usuário não encontrado para o email informado!');
    }
}


async function verificarSenha(senha, senhaHash){
    const senhaIsValid = await bcrypt.compare(senha,senhaHash);
    if(!senhaIsValid){
        throw new InvalidArgumentError('Email ou Senha invalido!');
    }
}

passport.use(
    new LocalStrategy({
        usernameField:'email',
        passwordField:'senha',
        session:false
    }, async (email,senha,done) =>{
        try {
            const usuario =await Usuario.buscaPorEmail(email);

            verificarUsuario(usuario);
            await verificarSenha(senha, usuario.senhaHash);

            done(null,usuario);

        } catch (error) {
            done(error);
        }
       
    })
);


passport.use(
    new BearerStrategy(
       async (token,done) =>{

        try {
            
              //valida o token com base na chave secreta
           const payload = fwt.verify(token,process.env.CHAVE_JWT);

           const usuario = await Usuario.buscaPorId(payload.id);
           done(null,usuario);

        } catch (error) {
            done(error);
        }
          

        }
    )
)
