const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
const clientId = process.env.CANVA_CLIENT_ID;
const clientSecret = process.env.CANVA_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Rota para redirecionar para o Canva OAuth2
app.get('/auth/canva', (req, res) => {
    const authUrl = `https://api.canva.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
});

// Rota de callback após a autenticação do Canva
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios.post('https://api.canva.com/oauth2/token', {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code,
            grant_type: 'authorization_code',
        });

        const { access_token } = response.data;
        // Aqui você pode usar o access_token para fazer chamadas à API do Canva
        res.send(`Autenticado com sucesso. Token de acesso: ${access_token}`);
    } catch (error) {
        console.error(error);
        res.send('Erro durante a autenticação com o Canva.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
