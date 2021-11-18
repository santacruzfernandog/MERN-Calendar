/*
    Controladores que van a manejar la logica de mis rutas / Auth
*/
const { response } = require('express')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')



const crearUsuario = async(req, res = response) => {

    const { name, email, password } = req.body
    
    try {
        // Validacion: Verificar email duplicado
        let usuario = await Usuario.findOne({ email })

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con el correo ingresado.'
            })
        }

        usuario = new Usuario( req.body )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save()

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador.'
        })
    }

}



const loginUsuario = async(req, res = response) => {
    
    const { email, password } = req.body

    try {
        // Verificar existencia del email
        const usuario = await Usuario.findOne({ email })

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El email ingresado no existe.'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta.'
            })
        }

        
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador.'
        })
    }
}



const revalidarToken = async(req, res = response) => {

    const { uid, name } = req
    
    // Generar JWT
    const token = await generarJWT( uid, name )

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}