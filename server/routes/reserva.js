let express = require('express');
let app = express();

const oracledb = require('oracledb');
const con = require('../config/configBD');

app.post('/reserva', async(req, res) => {
    console.log('POST RESERVA');

    const { horaLlegada, total, idCliente, idDepartamento, fechaInicio, fechaTermino, acompaniantes, adelanto } = req.body;

    if (horaLlegada && total && idCliente && idDepartamento && fechaInicio && fechaTermino && acompaniantes && adelanto) {

        const sql = `BEGIN CREAR_RESERVA( :horaLlegada, :total, :idCliente, :idDepartamento, :fechaInicio, :fechaTermino, :acompaniantes, :adelanto, :estado, :checkIn, :checkOut ); END;`;
        const binds = {
            horaLlegada: horaLlegada,
            total: total,
            idCliente: idCliente,
            idDepartamento: idDepartamento,
            fechaInicio: fechaInicio,
            fechaTermino: fechaTermino,
            acompaniantes: acompaniantes,
            adelanto: adelanto,
            estado: 1,
            checkIn: null,
            checkOut: null
        }

        const result = await con.Open(sql, binds, true);

        con.doRelease();

        res.json({
            ok: true,
            mesagge: 'Operacion exitosa'
        });
    } else {
        res.json({
            ok: false,
            mesagge: 'Operacion fallida'
        });
    }
});

app.put('/reserva', async(req, res) => {
    console.log('PUT RESERVA');

    const sql = `UPDATE RESERVA RE SET RE.ESTADO = 0 WHERE RE.ID_RESERVA = :id`;
    const bind = { id: req.body.id };

    const result = await con.Open(sql, bind, true);

    con.doRelease();

    res.json(result);

});

app.get('/reserva/serviciosExtras', async(req, res) => {
    console.log('GET SERVICIOS EXTRAS');

    const sql = `SELECT  dep.id_departamento,
                         se.id_servicio,
                         se.precio_servicio            
                 FROM departamento_servicio_detalle dsd
                 JOIN departamento DEP ON (dsd.id_departamento = dep.id_departamento)
                 JOIN servicio_extra SE ON (dsd.id_servicio = se.id_servicio)
                 ORDER BY 1 ASC`;

    const result = con.Open(sql, {}, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let serviciosSchema = {
            'id_departamento': obj[0],
            'id_servicio': obj[1],
            'precio_servicio': obj[2]
        }
        lista.push(serviciosSchema);
    });

    con.doRelease();

    res.json(lista);
});

module.exports = app;