let express = require('express');
let app = express();

const con = require('../config/configBD');

app.post('/direccion', async(req, res) => {
    console.log('GET DIRECCION');

    const sql =
        `SELECT  reg.id_region, 
                     reg.nombre_region,
                     pro.id_provincia,
                     pro.nombre_provincia,
                     co.id_comuna,
                     co.nombre_comuna
             FROM COMUNA CO
             JOIN PROVINCIA PRO ON (pro.id_provincia = co.id_provincia)
             JOIN REGION REG ON (pro.id_region = reg.id_region)`;

    const result = await con.Open(sql, {}, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let direccionSchema = {
            'id_region': obj[0],
            'nombre_region': obj[1],
            'id_provincia': obj[2],
            'nombre_provincia': obj[3],
            'id_comuna': obj[4],
            'nombre_comuna': obj[5]
        }
        lista.push(direccionSchema);
    });

    con.doRelease();

    res.json(lista);
});

app.post('/regiones', async(req, res) => {
    console.log('GET REGION');

    const sql = `SELECT * FROM REGION`;

    const result = await con.Open(sql, {}, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let direccionSchema = {
            'id_region': obj[0],
            'nombre_region': obj[1]
        }
        lista.push(direccionSchema);
    });

    con.doRelease();

    res.json(lista);

});

app.post('/provincias', async(req, res) => {
    console.log('POST PROVINCIA BY ID');
    let step = "0";
    console.log(req.body);

    const sql = `SELECT * FROM PROVINCIA
                 WHERE id_region = :id`;
    step = "1";
    const binds = { id: req.body.id };

    const result = await con.Open(sql, binds, false);
    step = "2";
    const resultSet = result.rows;

    let lista = [];


    resultSet.map(obj => {
        let direccionSchema = {
            'id_provincia': obj[0],
            'nombre': obj[1],
            'id_region': obj[2]
        }
        lista.push(direccionSchema);
    });

    con.doRelease();

    res.json(lista);
});

app.post('/comunas', async(req, res) => {
    console.log('POST COMUN');

    const sql = `SELECT * FROM COMUNA WHERE ID_PROVINCIA = :id`;

    const bind = { id: req.body.id };

    const result = await con.Open(sql, bind, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let comunaSchema = {
            'id_comuna': obj[0],
            'nombre_comuna': obj[1],
            'id_provincia': obj[2]
        }
        lista.push(comunaSchema);
    });

    con.doRelease();

    res.json(lista);
});


module.exports = app;