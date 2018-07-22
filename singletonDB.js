var SingletonDB = (function () {
    var instance;
    sqlite3 = require('sqlite3').verbose();
    function createInstance() {
        let db = new sqlite3.Database('./db/webBoardDB.db', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the webBoardDB database.');
        });
        return db;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function getPaintFromUrl(url,callback){
    let db = SingletonDB.getInstance();
    let sql = `SELECT * FROM \'`+ url +`\'`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);

    });
}

function insertElemnt(url,x,y,color) {
    let db = SingletonDB.getInstance();
    db.run(`INSERT INTO \'`+url+`\' (x,y,color) VALUES(?,?,?)`, [x,y,color], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id

    });
}
function createTablePage(tableName){
    let db = SingletonDB.getInstance();
    db.run('CREATE TABLE IF NOT EXISTS \''+tableName+'\' (\n' +
        ' id integer PRIMARY KEY AUTOINCREMENT ,\n' +
        ' color integer ,\n' +
        ' x integer NOT NULL,\n' +
        ' y integer NOT NULL\n' +
        ');');
}
function serializeCreateAndGet(tableName,callback){
    let db = SingletonDB.getInstance();
    let sql = `SELECT * FROM \'`+ tableName +`\'`;
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS \'' + tableName + '\' (\n' +
            ' id integer PRIMARY KEY AUTOINCREMENT ,\n' +
            ' color integer ,\n' +
            ' x integer NOT NULL,\n' +
            ' y integer NOT NULL\n' +
            ');').all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    });
}
function createDB(){
    let db = SingletonDB.getInstance();
    db.run('CREATE TABLE IF NOT EXISTS \'/\' (\n' +
        ' id integer PRIMARY KEY AUTOINCREMENT ,\n' +
        ' color integer ,\n' +
        ' x integer NOT NULL,\n' +
        ' y integer NOT NULL\n' +
        ');');
    db.run('CREATE TABLE IF NOT EXISTS users (\n' +
        ' ip VARCHAR(30) ,\n' +
        ' userAgent VARCHAR(200) ,\n' +
        ' currentNumOfElements integer DEFAULT 0,\n' +
        ' limitNumOfElements integer DEFAULT -1\n,' +
        'PRIMARY KEY (ip, userAgent)'+
        ');');
}


function closeDB(){
    let db = SingletonDB.getInstance();
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        instance = undefined;
        console.log('Close the database connection.');
    });
}

module.exports = { SingletonDB, getPaintFromUrl, closeDB, createDB, createTablePage, insertElemnt,serializeCreateAndGet};