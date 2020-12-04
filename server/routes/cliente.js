let express = require('express');
let app = express();

const oracledb = require('oracledb');
const con = require('../config/configBD');

app.post('/cliente', async(req, resp) => {
    console.log('POST CLIENTE');
    const { rut, pNombre, sNombre, pApellido, sApellido, email, telefono } = req.body;

    let idCliente = await findClientByRut(rut);

    if(idCliente > -1) {
        resp.json({
            ok: true,
            message: 'Ya existe el cliente',
            id: idCliente
        });
    } else {
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
            
            idCliente = await findClientByRut(rut);            
    
            resp.json({
                ok: true,
                message: 'Operacion exitosa, se creo el cliente',
                id: idCliente
            });
        } else {
            resp.json({
                ok: false,
                message: 'Operacion exitosa'
            });
        }
    }

    
});

const findClientByRut = async(clienteRut) => {
    try {

        console.log('FUNCION findClientByRut');
        
        const rut = clienteRut;
    
        const sql = `SELECT id_cliente FROM CLIENTE WHERE RUT_CLIENTE = :rutCliente`;
        
        const binds = {rutCliente: rut};
        
        const result = await con.Open(sql, binds, false);
    
        const resultSet = result.rows;

        let idcliente = -1;

        if(resultSet.length <= 0){

        } else{
            resultSet.map(id => {
                idcliente = id[0];
            })        
            con.doRelease();
            return idcliente
        }       
        return idcliente
    } catch(ex) {
        console.log(`error en la wea ${ex}`);
    }
};

module.exports = app;