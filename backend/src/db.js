const fs = require("fs");
// const sqlite3 = require("sqlite3").verbose();
const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const filepath = "./fund.db";

const dbPass = process.env.DBPASSWORD;

// https://www.digitalocean.com/community/tutorials/how-to-use-sqlite-with-node-js-on-ubuntu-22-04

function createDbConnection() {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}

function createTable(db) {

  console.log("createTable");

  // db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

  var fullScript = "PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';" + `

  CREATE TABLE fgroup (
    groupId varchar(100) NOT NULL PRIMARY KEY,
    imageLink varchar(100) NULL,
    name text NOT NULL,
    description text NULL,
    owner varchar(100) NOT NULL,
    createdTime varchar(100) NOT NULL,
    restriction varchar(100) NULL,
    topic varchar(100) NULL
  ) ;

  CREATE TABLE fjoingroup (
    groupId varchar(100) NOT NULL,
    user varchar(100) NOT NULL,
    primary key (groupId, user)
  );

  CREATE TABLE fcampaign (
    campaignId varchar(100) NOT NULL PRIMARY KEY,
    imageLink varchar(100) NULL,
    name text NOT NULL,
    description text NULL,
    groupId varchar(100) NULL
  ) ;
  
  CREATE TABLE fpost (
    postId varchar(100) NOT NULL PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    owner varchar(100) NOT NULL,
    createdTime varchar(100) NOT NULL,
    groupId varchar(100) NOT NULL,
    FOREIGN KEY(groupId) REFERENCES fgroup(groupId)
  ) ;

  CREATE TABLE fcomment (
    commentId varchar(100) NOT NULL PRIMARY KEY,
    postId varchar(100) NOT NULL,
    owner varchar(100) NOT NULL,
    description text NOT NULL,
    createdTime varchar(100) NOT NULL,
    FOREIGN KEY(postId) REFERENCES fpost(postId)
  ) ;

  CREATE TABLE ffriend (
    user1 varchar(100) NOT NULL,
    user2 varchar(100) NOT NULL,
    primary key (user1, user2)
  );

  CREATE TABLE fmessage (
    fromUser varchar(100) NOT NULL,
    toPair varchar(100) NOT NULL,
    message text NULL,
    timestamp varchar(100) NOT NULL
  );

`;

  db.exec(fullScript);
}

module.exports = createDbConnection();
