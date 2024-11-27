const express = require('express');
const { body } = require('express-validator');

const pratoController = require('../controllers/prato');

const router = express.Router();

// GET /cantina/pratos
router.get('/pratos', pratoController.getPratos);

// POST /cantina/prato
router.post(
    '/prato', 
    [
        // body('title')
        //     .trim()
        //     .isLength({ min: 5 }),
        // body('content')
        //     .trim()
        //     .isLength({ min: 5 })
    ],
    pratoController.createPrato
);

router.get(
    '/prato/:postId',
    [],
     pratoController.getPrato
);

router.put(
    '/prato/:postId',
    [],
    pratoController.updatePost
);

router.delete(
    '/prato/:postId', 
    pratoController.deletePost
);

module.exports = router;
