require('./config/config');

const express = require('express');
const oracledb = require('oracledb');
const app = express();
const con = require('./config/configBD');
const bodyParser = require('body-parser');

// parse application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//#region DIRECCION
app.get('/direccion', async(req, res) => {
    console.log('GET DIRECCION');

    const sql =
        `SELECT  reg.id_region, 
                     reg.nombre_region,
                     pro.id_provincia,
                     pro.nombre_provincia,
                     co.id_comuna,
                     co.nombre_comuna
             FROM COMUNA CO
             JOIN PROVINCIA PRO ON (co.id_comuna = pro.id_provincia)
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

    res.json(lista);
});
//#endregion

//#region DEPARTAMENTOS
app.get('/departamento', async(req, res) => {
    console.log('GET DEPARTAMENTO');

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'matias',
            password: '123',
            connectString: "localhost:1521/XE"
        });

        const result = await connection.execute(
            `BEGIN LEER_DEPARTAMENTO( :id, :CURSOR_ ); END;`, {
                id: req.body.id,
                CURSOR_: { type: oracledb.CURSOR, dir: oracledb.BIND_INOUT }
            }
        );

        const resultSet = result.outBinds.CURSOR_;
        console.log('El resultset es', resultSet);

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
            // row.map(dpto => {
            //     console.log(dpto);
            //     let dptoSchema = {
            //         'id': dpto[0],
            //         'nombre': dpto[1]
            //     }
            //     Departamentos.push(dptoSchema);
            // });
        }
        resultSet.close();

        res.json(Departamentos);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }

});

app.get('/departamentos', async(req, res) => {
    console.log('GET DEPARTAMENTOS');

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'matias',
            password: '123',
            connectString: "localhost:1521/XE"
        });

        const result = await connection.execute(
            `BEGIN LEER_DEPARTAMENTOS( :CURSOR_ ); END;`, {
                CURSOR_: { type: oracledb.CURSOR, dir: oracledb.BIND_INOUT }
            }
        );

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
            // row.map(dpto => {
            //     console.log(dpto);
            //     let dptoSchema = {
            //         'id': dpto[0],
            //         'nombre': dpto[1]
            //     }
            //     Departamentos.push(dptoSchema);
            // });
        }
        res.json(Departamentos);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }

});

app.get('/serviciosextras', async(req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'matias',
            password: '123',
            connectString: "localhost:1521/XE"
        });

        const result = await connection.execute(
            `SELECT  dep.id_departamento,
                     se.id_servicio,
                     se.precio_servicio            
             FROM departamento_servicio_detalle dsd
             JOIN departamento DEP ON (dsd.id_departamento = dep.id_departamento)
             JOIN servicio_extra SE ON (dsd.id_servicio = se.id_servicio)
             ORDER BY 1 ASC`
        );

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

        res.json(lista);

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});
//#endregion

//#region RESERVA
app.post('/reserva', async(req, res) => {
    console.log('POST RESERVA');

    let step = 0;
    const { horaLlegada, total, idCliente, idDepartamento, fechaInicio, fechaTermino, acompaniantes, adelanto } = req.body;

    try {
        step = 1;
        connection = await oracledb.getConnection({
            user: 'matias',
            password: '123',
            connectString: "localhost:1521/XE"
        });

        if (horaLlegada && total && idCliente && idDepartamento && fechaInicio && fechaTermino && acompaniantes && adelanto) {
            step = 2;
            result = await connection.execute(
                `BEGIN CREAR_RESERVA( :horaLlegada, :total, :idCliente, :idDepartamento, :fechaInicio, :fechaTermino, :acompaniantes, :adelanto, :estado, :checkIn, :checkOut ); END;`, {
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
                }, { autoCommit: true }
            );

            step = 3;



            res.json({ ok: true, mesagge: 'Operacion exitosa' });
        } else {
            res.json({ ok: false, mesagge: 'Operacion fallida' });
        }

    } catch (err) {
        console.log('primer catch');
        console.error(err, 'paso: ', step);
    } finally {
        if (connection) {
            try {
                console.log('cerrar conexion');
                await connection.close();
                console.log('paso el cierre');
                // res.json({ ok: false, mesagge: 'fallo' });
            } catch (err) {
                console.log('segundo catch');
                console.error(err, 'paso: ', step);
            }
        }
    }
});

app.put('/reserva', async(req, res) => {
    console.log('PUT RESERVA');

    let connection;

    let step = 0;

    try {
        step = 1;

        connection = await oracledb.getConnection({
            user: 'matias',
            password: '123',
            connectString: "localhost:1521/XE"
        });
        step = 2;

        result = await connection.execute(
            `UPDATE RESERVA RE SET RE.ESTADO = 0 WHERE RE.ID_RESERVA = :id`, {
                id: req.body.id
            }, { autoCommit: true }
        );
        step = 3;

        res.json(result);

    } catch (err) {
        console.error(err, 'paso: ', step);
    } finally {
        if (connection) {
            try {
                console.log('cerrar conexion');
                await connection.close();
            } catch (err) {
                console.error(err, 'paso: ', step);
            }
        }
    }
});
//#endregion

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});