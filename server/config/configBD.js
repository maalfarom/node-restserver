const oracledb = require('oracledb');

connection = {
    user: 'matias',
    password: '123',
    connectString: "localhost:1521/XE"
};

let conex;

async function Open(sql, binds, autoCommit) {
    try {
        conex = await oracledb.getConnection(connection);
        result = await conex.execute(sql, binds, { autoCommit });
    } catch (err) {
        console.error(err);
    }
    return result;
}

function doRelease() {
    conex.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
    console.log(`db released successfully`);
}

exports.Open = Open;
exports.doRelease = doRelease;