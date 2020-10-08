const usuariosControlador = require('./usuarios-controlador');
const middlewareAutenticacao = require('./middleware-autenticacao');
const passport = require('passport');

module.exports = app => {
  app
    .route('/usuario/login')
    /*Inseri o middleware de autenticação chamando a estrategia local que vai validar se o cliente está autenticado ou não
     indicando que não será usado sessões
    */
    .post(
      //passport.authenticate('local',{session : false}), 
   // instrução acima, substituida pelo middleware customizado para tratar diversos cenários de erro 
    middlewareAutenticacao.local, 
    usuariosControlador.login);

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
  .route('/usuario/:id')
  .delete(
    //passport.authenticate('bearer',{session:false}), 
     //passamos a usar o middleware customizado para autenticacao
     middlewareAutenticacao.bearer,
    usuariosControlador.deleta);
};
