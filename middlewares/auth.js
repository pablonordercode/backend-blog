const jwt = require('jsonwebtoken');

// Função para verificar se o token JWT é válido
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
        return res.status(403).json({ msg: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(403).json({ msg: 'Token inválido' }); 
    }
};

module.exports = { verifyToken };
