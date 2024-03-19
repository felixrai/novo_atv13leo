// Importar as dependências
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');

// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar o middleware para gerenciar sessões e cookies
app.use(cookieParser());
app.use(session({
    secret: 'seuSegredo', // Uma string aleatória usada para assinar o cookie da sessão
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Tempo de vida do cookie em milissegundos (1 dia, por exemplo)
        httpOnly: true // Impede o acesso ao cookie pelo JavaScript do cliente
    }
}));


app.get('/login', (req, res) => {
    // Verificar se há uma mensagem de erro na query string
    const errorMessage = req.query.error ? 'Credenciais inválidas! Tente novamente.' : null;
    res.render('login', { error: errorMessage });
});


const users = [
    { id: 1, email: 'usuario1@example.com', password: 'senha1' },
    { id: 2, email: 'usuario2@example.com', password: 'senha2' },
    { id: 3, email: 'usuario3@example.com', password: 'senha3' }
];


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Verificar se o usuário existe no "banco de dados"
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        // Salvar os dados do usuário no cookie
        req.session.user = user;
        res.redirect('/login/success'); // Redirecionar para a página de sucesso
    } else {
        res.redirect('/login?error=true'); // Redirecionar de volta para a página de login com mensagem de erro
    }
});


app.get('/login/success', (req, res) => {
    res.render('login-success');
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Limpar a sessão
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
        } else {
            // Redirecionar para a página de login após o logout
            res.clearCookie('connect.sid'); // Limpar o cookie da sessão
            res.redirect('/login');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
