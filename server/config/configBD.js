const oracledb = require('oracledb');

connection = {
    user: 'matias',
    password: '123',
    connectString: "localhost:1521/XE"
};

async function Open(sql, binds, autoCommit) {
    let conex;
    try {
        conex = await oracledb.getConnection(connection);
        result = await conex.execute(sql, binds, { autoCommit });
    } catch (err) {
        console.error(err);
    } finally {
        if (conex) {
            try {
                await conex.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
    return result;
}

exports.Open = Open;