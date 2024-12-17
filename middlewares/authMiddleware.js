const jwt = require('jsonwebtoken');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || " "; 

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(403).json({ msg: "Acesso negado. Token não fornecido." });
        }
    
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.admin = decoded; // Salva os dados do admin no request
            next();
        } catch (error) {
            return res.status(403).json({ msg: "Token inválido ou expirado" });
        }
};

module.exports = authMiddleware;
