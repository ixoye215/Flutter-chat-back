const { response } = require("express");
const bycrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

//Ejecuta una vez que pasa por las validacion y la ruta
const crearUsuario = async (req, res = response)=>{

    const { email, pass } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado',
            });
        }

        const usuario = new Usuario( req.body );
        //Encriptar contraseña
        const salt = bycrypt.genSaltSync();
        usuario.pass = bycrypt.hashSync( pass, salt );

        await usuario.save();
        //Generar JWT
        const token = await generarJWT(usuario.id);

        //Mandar Respuesta
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const login = async (req, res = response) => {

    const {email, pass} = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({email});

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            });
        }

        //Validar el password
        const validPassword = bycrypt.compareSync( pass, usuarioDB.pass);
        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg: 'La contraseña no es valida'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });     
    }

}

const renewToken = async (req, res) =>{

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}