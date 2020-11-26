let express = require('express');
let app = express();

const oracledb = require('oracledb');
const con = require('../config/configBD');

app.post('/cliente', async(req, resp) => {
    console.log('POST CLIENTE');
    const { rut, pNombre, sNombre, pApellido, sApellido, email, telefono } = req.body;

    if (rut, pNombre, pApellido, sApellido, email, telefono) {

        const sql = `BEGIN CREAR_CLIENTE (:rut, :pNombre, :sNombre, :pApellido, :sApellido, :email, :telefono); END;`;

        const binds = {
            rut: rut,
            pNombre: pNombre,
            sNombre: sNombre,
            pApellido: pApellido,
            sApellido: sApellido,
            email: email,
            telefono: telefono
        };

        const result = await con.Open(sql, binds, true);

        con.doRelease();

        resp.json({
            ok: true,
            message: 'Operacion exitosa'
        });
    } else {
        resp.json({
            ok: false,
            message: 'Operacion exitosa'
        });
    }
});

module.exports = app;