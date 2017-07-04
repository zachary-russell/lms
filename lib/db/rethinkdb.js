var r = require('rethinkdb');
var async = require('async');
var configs = require('../../configs/configs.js');
var db = {} = module.exports;

db.init = function(callback) {
  console.log('starting connection');
  console.log(configs.rethinkdb);
  async.waterfall([
  function connect(callback) {
    r.connect(configs.rethinkdb, callback);
  },
  function createDatabase(connection, callback) {
    r.dbList().contains(configs.rethinkdb.db).do(function(containsDb) {
      return r.branch(
        containsDb,
        {created: 0},
        r.dbCreate(configs.rethinkdb.db)
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function createTable(connection, callback) {
    //Create the table if needed.
    r.tableList().contains('links').do(function(containsTable) {
      return r.branch(
        containsTable,
        {created: 0},
        r.tableCreate('links')
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  }], function(err, connection) {
  if(err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.log('initalized DB');
  db.connection = connection;
  return callback();
  }

)};

db.addLink = function(id, object, callback) {
  r.table("links").insert(object).run(db.connection, function(err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
    return callback(null, id);
  })
}
db.getLinks= function(params, callback) {
  r.table("links").filter(params).run(db.connection, function(err, cursor) {
        if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        return callback(null, result);
    });
});
}
db.getTimer = function(id, callback) {
  r.table("timers").get(id).run(db.connection, function(err, result) {
    if (err) throw err;
    return callback(null, result);
  });
}
db.deleteTimer = function(id, callback) {
    r.table("timers").get(id).delete({returnChanges: true}).run(db.connection, function(err, result){
        if (err) throw err;
        return callback(null, result);
    });
}
db.updateTimer = function(id, obj, callback) {
    r.table("timers").get(id).update(obj, {returnChanges: true}).run(db.connection, function(err, result) {
        if (err) throw err;
        return callback(null, result);
    })

}
