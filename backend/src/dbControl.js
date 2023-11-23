const db = require("./db");

const dbPass = process.env.DBPASSWORD;

async function addNewComment(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`INSERT INTO fcomment (commentId, postId, owner, description, createdTime) VALUES (?, ?, ?, ?, ?)`);
    await stmt.run(object);
    await stmt.finalize();
}

async function addNewPost(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`INSERT INTO fpost (postId, title, description, owner, createdTime, groupId) VALUES (?, ?,?, ?, ?, ?)`);
    await stmt.run(object);
    await stmt.finalize();
}

async function addNewGroup(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`  INSERT INTO fgroup (groupId, imageLink,name, description, owner, createdTime, restriction, topic) VALUES (?,?,?, ?, ?, ?, ?, ?);
    `);
    await stmt.run(object);
    await stmt.finalize();
}

async function addNewJoinGroup(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`  INSERT INTO fjoingroup (groupId, user) VALUES (?,?);`);
    await stmt.run(object);
    await stmt.finalize();
}

async function addNewFundraisingCampaign(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`  INSERT INTO fcampaign (campaignId, imageLink,name, description, groupId) VALUES (?,?,?, ?, ?);
    `);
    await stmt.run(object);
    await stmt.finalize();
}

function getAllGroups() {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fgroup", (error, rows) => {
            if (error) {
                // throw new Error(error.message);
                reject(error);
            }
            console.log(rows);
            resolve(rows);
        });
    })
}

function filterGroups(user, search) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");
        // SELECT * FROM fgroup where name like '%Here%' or description like '%Here%'
        // db.all("SELECT * FROM fgroup where name like '%"+search+"%' or description like '%"+search+"%'", (error, rows) => {
        // SELECT * FROM fgroup left join (select * from fjoingroup WHERE fjoingroup.user="0xb9D8c37FcE961e19B300D89EB0D0326389a26F4d") AS t on fgroup.groupId=t.groupId where fgroup.name like '%Here%' or fgroup.description like '%Here%';
        db.all("SELECT * FROM fgroup left join (select groupId gId, user from fjoingroup WHERE fjoingroup.user='"+user+"') AS t on fgroup.groupId=t.gId where fgroup.name like '%"+search+"%' or description like '%"+search+"%'", (error, rows) => {
                if (error) {
                    // throw new Error(error.message);
                    reject(error);
                }
                console.log(rows);
                resolve(rows);
            });
        })
}


function myGroups(user) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fgroup, fjoingroup WHERE fjoingroup.user='"+user+"' and fgroup.groupId=fjoingroup.groupId;", (error, rows) => {
            if (error) {
                // throw new Error(error.message);
                reject(error);
            }
            console.log(rows);
            resolve(rows);
        });
    })
}

// async function test() {
//     console.log( await getAllGroups());
// }

// test();

function getAllPostsOfGroup(groupId) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fpost WHERE groupId='"+groupId+"'", (error, rows) => {
            if (error) {
                throw new Error(error.message);
            }
            // console.log(row);
            resolve(rows);
        });
    })
}


// async function test() {
//     console.log( await getAllGroups());
// }

// test();

function getAllCommentsOfPost(postId) {
    return new Promise((resolve, reject) => {

        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fcomment WHERE postId='"+postId+"'", (error, rows) => {
            if (error) {
                throw new Error(error.message);
            }
            resolve(rows);
        });
    })
}

function getAllCampaignsOfGroup(groupId) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fcampaign WHERE groupId='"+groupId+"'", (error, rows) => {
            if (error) {
                throw new Error(error.message);
            }
            // console.log(row);
            resolve(rows);
        });
    })
}

// getAllGroups();
// getAllPostsOfGroup("0x08B2210b2fF974a406224f962e0Fed2abD6097cB");
// getAllCommentsOfPost("0xb14DE49C74Fe72313364981add8144d1DcF78089")

///////////////////////////////Chatapp

function addFriend(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = db.prepare(`insert into ffriend (user1, user2) values (?, ?)`);
    stmt.run(object);
    stmt.finalize();
}

function getAllFriends(myAddress) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT user1 as fr from ffriend where user2='"+myAddress+"' UNION SELECT user2 as fr from ffriend where user1='"+myAddress+"';", (error, rows) => {
            if (error) {
                // throw new Error(error.message);
                reject(error);
            }
            console.log(rows);
            resolve(rows);
        });
    })
}

async function addMessage(object) {
    db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

    const stmt = await db.prepare(`INSERT INTO fmessage (fromUser, toPair, message, timestamp) VALUES (?, ?,  ?, ?);`);
    await stmt.run(object);
    await stmt.finalize();
}

function getAllMessages(myPairAddress) {
    return new Promise((resolve, reject) => {
        db.exec("PRAGMA cipher_compatibility = 4;PRAGMA key = '"+dbPass+"';");

        db.all("SELECT * FROM fmessage WHERE toPair='"+myPairAddress+"';", (error, rows) => {
            if (error) {
                // throw new Error(error.message);
                reject(error);
            }
            console.log(rows);
            resolve(rows);
        });
    })
}

///////////////////////////////////////

module.exports = {
    getAllGroups,
    getAllPostsOfGroup,
    getAllCommentsOfPost,
    addNewComment,
    addNewPost,
    addNewGroup,
    addNewFundraisingCampaign,
    getAllCampaignsOfGroup,
    filterGroups,
    addNewJoinGroup,
    myGroups,
    // Chat app
    addFriend,
    getAllFriends,
    addMessage,
    getAllMessages
}
