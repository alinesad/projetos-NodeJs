const postsControlador = require('./posts-controlador');
const passport = require('passport');
const {middlewaresAutenticacao } = require('../usuarios');

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
    //  passport.authenticate('bearer',{session:false}),  
      //passamos a usar o middleware customizado para autenticacao
      middlewaresAutenticacao.bearer,
      postsControlador.adiciona);
};
