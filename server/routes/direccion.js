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

module.exports = app;