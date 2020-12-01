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

app.post('/departamento/comuna', async(req, res) => {
    console.log('POST DEPARTAMENTO POR COMUNA');

    const sql = 'SELECT * FROM DEPARTAMENTO WHERE ID_COMUNA = :id ';

    const binds = { id: req.body.id };

    const result = await con.Open(sql, binds, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let comunaSchema = {
            'id_departamento': obj[0],
            'nombre_departamento': obj[1],
            'numero_departamento': obj[2],
            'inventario_departamento': obj[3],
            'tarifa': obj[4],
            'nombre_comuna': obj[5],
            'disponibilidad': obj[6],
            'direccion': obj[7]
        }
        lista.push(comunaSchema);
    });

    con.doRelease();

    res.json(lista);
});

module.exports = app;