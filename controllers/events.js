const { response } = require("express")
const Evento = require("../models/Evento")


const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find().populate('user', 'name')

    res.json({
        ok: true,
        eventos
    })
}


const crearEvento = async( req, res = response ) => {

    const evento = new Evento( req.body )

    try {

        evento.user = req.uid
        const eventoGuardado = await evento.save()

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador, por favor.'
        })
    }
}


const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        //  Verificar si el id existe en BD
        const evento = await Evento.findById( eventoId )
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese ID no existe.'
            })
        }

        // Verificar que la persona que creo el evento es la que quiere actualizar
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene autorizacion para editar este evento.'
            })
        }

        // Actualizar evento
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } )

        res.json({
            ok: true,
            evento: eventoActualizado
        })
        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador, por favor.'
        })
    }
}


const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        //  Verificar si el id existe en BD
        const evento = await Evento.findById( eventoId )
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese ID no existe.'
            })
        }

        // Verificar que la persona que creo el evento es la que quiere actualizar
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene autorizacion para eliminar este evento.'
            })
        }


        await Evento.findByIdAndDelete( eventoId )

        res.json({
            ok: true
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador, por favor.'
        })
    }
}



module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}