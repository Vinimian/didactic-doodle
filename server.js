const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const clientId = process.env.CANVA_CLIENT_ID;
const clientSecret = process.env.CANVA_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Servir arquivos estáticos da pasta 'public' (onde está o index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial - Serve o index.html com o botão para autenticar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para iniciar a autenticação com o Canva
app.get('/auth/canva', (req, res) => {
    const authUrl = `https://api.canva.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
});

// Rota de callback após a autenticação - Troca o código pelo token de acesso
app.get('/callback', async (req, res) => {
    const { code } = req.query;  // Captura o código enviado pelo Canva

    try {
        // Troca o código de autenticação pelo token de acesso
        const response = await axios.post('https://api.canva.com/oauth2/token', {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: code,
            grant_type: 'authorization_code',
        });

        const { access_token } = response.data;

        // Aqui você pode usar o access_token para fazer chamadas à API do Canva
        res.send(`Autenticado com sucesso! Token de acesso: ${access_token}`);
    } catch (error) {
        console.error('Erro ao trocar o código pelo token:', error);
        res.status(500).send('Erro durante a autenticação com o Canva.');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.get('/callback', (req, res) => {
    console.log('Rota /callback acessada');
    res.send('Rota /callback acessada com sucesso!');
});
