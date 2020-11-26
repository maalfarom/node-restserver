let express = require('express');
let app = express();

const oracledb = require('oracledb');
const con = require('../config/configBD');

app.post('/departamentos', async(req, res) => {
    console.log('GET DEPARTAMENTOS');

    const sql = `BEGIN LEER_DEPARTAMENTOS( :CURSOR_ ); END;`;

    const binds = { CURSOR_: { type: oracledb.CURSOR, dir: oracledb.BIND_INOUT } };

    const result = await con.Open(sql, binds, false);

    const resultSet = result.outBinds.CURSOR_;

    let row;

    Departamentos = [];

    while ((row = await resultSet.getRow())) {
        let dptoSchema = {
            'id_departamento': row[0],
            'nombre_departamento': row[1],
            'numero_departamento': row[2],
            'inventario_departamento': row[3],
            'tarifa': row[4],
            'nombre_comuna': row[5],
            'disponibilidad': row[6],
            'direccion': row[7]
        };
        Departamentos.push(dptoSchema);
    }

    con.doRelease();

    res.json(Departamentos);
});

app.post('/departamento', async(req, res) => {
    console.log('GET DEPARTAMENTO');

    const sql = `BEGIN LEER_DEPARTAMENTO( :id, :CURSOR_ ); END;`;

    const bind = {
        id: req.body.id,
        CURSOR_: { type: oracledb.CURSOR, dir: oracledb.BIND_INOUT }
    };

    const result = await con.Open(sql, bind, false);

    const resultSet = result.outBinds.CURSOR_;

    let row;

    Departamentos = [];

    while ((row = await resultSet.getRow())) {
        console.log('La fila es: ', row[1]);
        let dptoSchema = {
            'id_departamento': row[0],
            'nombre_departamento': row[1],
            'numero_departamento': row[2],
            'inventario_departamento': row[3],
            'tarifa': row[4],
            'nombre_comuna': row[5],
            'disponibilidad': row[6],
            'direccion': row[7]
        };
        Departamentos.push(dptoSchema);
    }

    resultSet.close();

    con.doRelease();

    res.json(Departamentos);

});

module.exports = app;