const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

const jwt = require('jsonwebtoken');


function criaTokenJWT(usuario){

  const cincoDiasEmMilissegundos = 432000000;
  const payload = {
    id : usuario.id,
    //Adiciona tempo de expiração do token
    expiraEm : Date.now() + cincoDiasEmMilissegundos
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT);

  return token;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: (req , res) =>{

    //user colocado no momento que o passport é finalizado
    const token = criaTokenJWT(req.user);
    // Seta no header o token
    res.set('Authorization', token);
    //status = 204 Indica que a página de resposta é em branco e que os cabeçalhos podem ser utéis
    res.status(204).send();
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
