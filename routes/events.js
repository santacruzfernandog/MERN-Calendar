/*
    Event Routes
    /api/events
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

// Todas las peticiones deben pasar por validacion de JWT
// Subir de nivel un middleware que se aplica a todas las rutas
router.use( validarJWT )

// Obtener eventos
router.get('/', getEventos )

// Obtener eventos
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es requerida').custom( isDate ),
        check('end', 'Fecha de finalizacion es requerida').custom( isDate ),
        validarCampos
    ],
    crearEvento
)

// Obtener eventos
router.put('/:id', actualizarEvento )

// Obtener eventos
router.delete('/:id', eliminarEvento )


module.exports = router