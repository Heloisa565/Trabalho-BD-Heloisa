const express = require("express");
const app = express();

const Pagamento = require("./models/Pagamento");
const Usuario = require("./models/Usuario"); // Corrigido: Importa o modelo usuário
const path = require('path'); // Endereço de cada rota
const router = express.Router(); // Trabalha com as rotas
const moment = require('moment');
const handlebars = require("express-handlebars");

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rotas para Pagamento
router.get('/pagamento', function(req, res){
    res.sendFile(path.join(__dirname+'/pagamento.html'));
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

router.post('/pagamento', function(req, res){
    Pagamento.create({
        nome: req.body.nome,
        valor: req.body.valor
    }).then(function(){
        res.redirect('/pagamento');
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro);
    });
});

router.get('/lista', function(req, res){
    Pagamento.findAll().then(function(pagamentos){
        res.render('pagamento', { pagamentos: pagamentos });
    });
});

router.get('/del-pagamento/:id', function(req, res){
    Pagamento.destroy({
        where: { 'id': req.params.id }
    }).then(function(){
        res.redirect('/pagamento');
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi apagado com sucesso!" + erro);
    });
});

router.get('/edit-pagamento/:id', function(req, res){
    Pagamento.findByPk(req.params.id).then(function(pagamento){
        res.render('editar', { pagamento: pagamento });
    }).catch(function(erro){
        res.send("Erro: Não foi possível carregar o formulário de edição" + erro);
    });
});

// Rotas para Usuário
// Formulário de cadastro de usuário
router.get('/usuario', function(req, res){
    res.sendFile(path.join(__dirname+'/usuario.html'));
});

// Criação de usuário
router.post('/usuario', function(req, res){
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).then(function(){
        res.redirect('/usuario');
    }).catch(function(erro){
        res.send("Erro: Usuário não foi cadastrado com sucesso!" + erro);
    });
});

// Listar todos os usuários
router.get('/lista-usuario', function(req, res){
    Usuario.findAll().then(function(usuarios){
        res.render('usuario', { usuarios: usuarios });
    }).catch(function(erro){
        res.send("Erro: não foi possível listar os usuários" + erro);
    });
});

// Deletar um usuário
router.post('/del-usuario/:id', function(req, res){
    Usuario.destroy({
        where: { 'id': req.params.id }
    }).then(function(){
        res.redirect('/lista-usuario'); // Corrigido: Redireciona para a lista de usuários
    }).catch(function(erro){
        res.send("Erro: Não foi possível deletar o usuário" + erro);
    });
});

// Formulário de edição de usuário
router.get('/edit-usuario/:id', function(req, res){
    Usuario.findByPk(req.params.id).then(function(usuario){
        res.render('editarUsuario', { usuario: usuario });
    }).catch(function(erro){
        res.send("Erro: Não foi possível carregar o formulário de edição" + erro);
    });
});

// Atualizar usuário
router.post('/edit-usuario/:id', function(req, res){
    Usuario.update({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }, {
        where: { 'id': req.params.id }
    }).then(function(){
        res.redirect('/lista-usuario'); // Corrigido: Redireciona para a lista de usuários
    }).catch(function(erro){
        res.send("Erro: Não foi possível atualizar o usuário" + erro);
    });
});

// Rota Pagamento
app.use('/', router);
app.use('/pagamento', router);
app.use('/lista', router);
app.use('/del-pagamento/:id', router);
app.use('/edit-pagamento/:id', router);

// Rota Usuário
app.use('/usuario', router);
app.use('/lista-usuario', router);
app.use('/del-usuario/:id', router);
app.use('/edit-usuario/:id', router);

app.listen(8080, function(){
    console.log("Servidor rodando na porta 8080");
});