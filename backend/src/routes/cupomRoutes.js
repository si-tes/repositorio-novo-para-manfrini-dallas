const express = require('express');
const router = express.Router();
const cupomController = require('../controllers/cupomController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Público (Cliente)
router.post('/validar', cupomController.validarCupom);

// Administrativo
router.get('/', authMiddleware, adminMiddleware, cupomController.listarCupons);
router.post('/', authMiddleware, adminMiddleware, cupomController.criarCupom);
router.put('/:id', authMiddleware, adminMiddleware, cupomController.atualizarCupom);

module.exports = router;
