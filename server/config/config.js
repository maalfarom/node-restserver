// const oracledb = require('oracledb');

process.env.PORT = process.env.PORT || 3000;

// async function run() {
//     let connection;
//     connection = await oracledb.getConnection({
//             user: "matias",
//             password: "123",
//             connectString: "localhost:1521/xe"
//         },
//         function(err, connection) {
//             if (err) {
//                 console.error(err.message);
//                 return;
//             }
//             connection.execute(
//                 'SELECT * FROM COMUNA',
//                 function(err, result) {
//                     if (err) {
//                         console.error(err.message);
//                         doRelease(connection);
//                         return;
//                     }
//                     console.log(result.rows);
//                     doRelease(connection);
//                 })
//         }
//     );
// }

// module.exports = run;