let express = require('express');
let app = express();
const con = require('../config/configBD');

app.post('/reserva', async (req, res) => {
    console.log('POST RESERVA');

    try {
        const { horaLlegada, total, idCliente, idDepartamento, fechaInicio, fechaTermino, acompaniantes, adelanto, services } = req.body;

        console.log(`${horaLlegada} ${total} ${idCliente} ${idDepartamento} ${fechaInicio} ${fechaTermino} ${acompaniantes} ${adelanto} ${services}`);
        
        if (horaLlegada && total && idCliente && idDepartamento && fechaInicio && fechaTermino && acompaniantes && adelanto) {

            const validar = await validarFecha(fechaInicio, fechaTermino, idDepartamento);

            if (validar) {
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
                let servicesArray = JSON.parse(services);

                if(servicesArray.length > 0) {
                    let bookingId = await findBookingId(idDepartamento, fechaInicio, fechaTermino);
                    await extraService(servicesArray, bookingId);
                }

                res.json({
                    ok: true,
                    mesagge: 'Operacion exitosa'
                });
            } else {
                res.json({
                    ok: false,
                    mesagge: 'No hay cupos para esa fecha'
                });
            }
        } else {
            res.json({
                ok: false,
                mesagge: 'Operacion fallida, faltan datos'
            });
        }
    } catch (ex) {
        console.log(`Fallo en: ${ex}`);
    }
});

app.put('/reserva', async (req, res) => {
    console.log('PUT RESERVA');

    const sql = `UPDATE RESERVA RE SET RE.ESTADO = 0 WHERE RE.ID_RESERVA = :id`;
    const bind = { id: req.body.id };

    const result = await con.Open(sql, bind, true);

    con.doRelease();

    res.json(result);

});

app.post('/serviciosextras', async (req, res) => {
    console.log('GET SERVICIOS EXTRAS');

    console.log(req.body.id);

    const sql = `select dsd.id_departamento_servicio,
                    dsd.id_departamento,
                    dsd.id_servicio,
                    se.nombre_servicio,
                    se.precio_servicio
                 from departamento_servicio_detalle dsd
                 inner join servicio_extra se on (dsd.id_servicio = se.id_servicio)
                 where dsd.id_departamento = :id`;

    const binds = { id: req.body.id }

    const result = await con.Open(sql, binds, false);

    const resultSet = result.rows;

    let lista = [];

    resultSet.map(obj => {
        let serviciosSchema = {
            'id_departamento_servicio': obj[0],
            'id_departammento': obj[1],
            'id_servicio': obj[2],
            'nombre_servicio': obj[3],
            'precio_servicio': obj[4]
        }
        lista.push(serviciosSchema);
    });

    con.doRelease();

    res.json(lista);
});


app.post('/pruebas', async (req, res) => {
    console.log("POST PRUEBAS");

    findBookingId(2, '01/09/20', '02/09/20');
});

const validarFecha = async (fecInicio, fecTermino, idDepto) => {
    try {
        const sql =
        `SELECT *
        FROM reserva
        WHERE (fecha_inicio BETWEEN :fecInicio and :fecTermino
        OR  fecha_termino BETWEEN :fecInicio AND :fecTermino)
        AND id_departamento = :id
        AND estado = 1`;

        const binds = {
            fecInicio: fecInicio,
            fecTermino: fecTermino,
            id: idDepto
        };

        const result = await con.Open(sql, binds, false);

        const resultSet = await result.rows;

        console.log(resultSet);

        if (resultSet.length) {
            con.doRelease();
            console.log('no puede reservar');
            return false;
        } else {
            console.log('puede reservar');
            con.doRelease();
            return true;
        }

    } catch (ex) {
        console.log('Fallo en la funcion validarFecha: ', ex);
    }
};

let extraService = async( services,idReserva) => {
    try {

        services.forEach(async element => {
            console.log('id del servicio: ', element);
            
            const sql = 
            `INSERT INTO reserva_dep_ser_detalle (ID_DEPARTAMENTO_SERVICIO, ID_RESERVA) VALUES (:services, :idReserva)`;
            
            const binds = {
                services: element,
                idReserva: idReserva
            };

            
            const result = await con.Open(sql, binds, true);
            
            con.doRelease();
        });

    } catch(ex) {
        console.log('Error en la funcion extraService: ', ex);
    }
};

let findBookingId = async(idDepto, fecInicio, fecTermino) => {
    try {
        const sql = 
        `SELECT id_reserva
        FROM RESERVA
        WHERE id_departamento = :idDepto
        AND FECHA_INICIO = :fecInicio
        AND FECHA_TERMINO = :fecTermino`;

        const binds = {
            idDepto: idDepto,
            fecInicio: fecInicio,
            fecTermino: fecTermino
        };

        let result = await con.Open(sql, binds, false);

        let resultSet = await result.rows;

        let bookingId = -1;

        if(resultSet.length <= 0) {

        } else {
            resultSet.map( id => {
                bookingId = id[0];
                con.doRelease();
            });
            return bookingId;
        }

        return bookingId;

    } catch( ex ) {
        console.log('Error funcion findBookingId: ', ex);
    }
}

module.exports = app;