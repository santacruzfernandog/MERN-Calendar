/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express')
const { check } = require('express-validator') // 'check' es el middleware que se va a encargar de validar un campo en particular. Valida un campo a la vez.
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()


router.post(
    '/new',
    [ // Middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe contener 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario)

router.post(
    '/',
    [ // Middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe contener 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario)

router.get('/renew', validarJWT, revalidarToken)


module.exports = router