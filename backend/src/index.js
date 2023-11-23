var express = require("express");
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "10000mb"}));

var cors = require('cors')

const dbControl = require("./dbControl");

app.use(cors())

app.post('/filtergroups', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(await dbControl.getAllGroups());
    var search = req.body.search;
    var user = req.body.userAddress;
    var rs = await dbControl.filterGroups(user, search);
    console.log(rs);
    res.status(200);
    res.send(rs);
})

app.post('/mygroups', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(await dbControl.getAllGroups());
    var user = req.body.userAddress;
    var rs = await dbControl.myGroups(user);
    
    res.status(200);
    res.send(rs);
})

app.post('/allgroups', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(await dbControl.getAllGroups());

    var user = req.body.userAddress;
    res.status(200);
    res.send(await dbControl.getAllGroups());
})


app.post('/posts', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    var rs = await dbControl.getAllPostsOfGroup(req.body.groupId);
    console.log(rs);
    res.status(200);
    res.send(rs);
})

app.post('/comments', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    var rs = await dbControl.getAllCommentsOfPost(req.body.postId);
    console.log(rs);
    res.status(200);
    res.send(rs);
})

app.post('/newcomment', async function (req, res) {
    console.log('newcomment');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    await dbControl.addNewComment(req.body.comment);

    res.status(200);
    res.send("Done");
})

app.post('/newpost', async function (req, res) {
    console.log('new post');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    await dbControl.addNewPost(req.body.post);

    res.status(200);
    res.send("Done");
})

app.post('/newgroup', async function (req, res) {
    console.log('new group');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    await dbControl.addNewGroup(req.body.group);

    await dbControl.addNewJoinGroup(req.body.joingroup);

    res.status(200);
    res.send("Done");
})

app.post('/newjoingroup', async function (req, res) {
    console.log('new join group');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    await dbControl.addNewJoinGroup(req.body.joingroup);

    res.status(200);
    res.send("Done");
})

app.post('/newcampaign', async function (req, res) {
    console.log('new group');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    await dbControl.addNewFundraisingCampaign(req.body.campaign);

    res.status(200);
    res.send("Done");
})

app.post('/campaigns', async function (req, res) {
    console.log('receiving data ...');
    console.log(req.body);

    // console.log(dbControl.getAllGroups());
    var rs = await dbControl.getAllCampaignsOfGroup(req.body.groupId);
    console.log(rs);
    res.status(200);
    res.send(rs);
})

app.post('/addfriend', async function (req, res) {
    console.log('add friend');
    console.log(req.body);
    var user1 = req.body.user1;
    var user2 = req.body.user2;
    if (user1 > user2 ) {
        await dbControl.addFriend([user1, user2]);
    } else {
        await dbControl.addFriend([user2, user1]);
    }

    res.status(200);
    res.send("Done");
})

app.post('/getallfriends', async function (req, res) {
    console.log('get all friends');
    console.log(req.body);
    var userAddress = req.body.userAddress;
    
    var rs = await dbControl.getAllFriends(userAddress);
    
    res.status(200);
    res.send(rs);
})

app.post('/addmessage', async function (req, res) {
    console.log('add message');
    console.log(req.body);
    var fromUser = req.body.fromUser;
    var toUser = req.body.toUser;
    var message = req.body.message;
    var currTimeStamp = (new Date().getTime()) + "";
    var toPair = fromUser + "-"+toUser;
    if (fromUser < toUser ) {
        toPair = toUser + "-"+fromUser;
    }

    await dbControl.addMessage([fromUser, toPair, message, currTimeStamp]);    

    res.status(200);
    res.send("Done");
})

app.post('/getallmessages', async function (req, res) {
    console.log('get all messages');
    console.log(req.body);
    var fromUser = req.body.fromUser;
    var toUser = req.body.toUser;

    var toPair = fromUser + "-"+toUser;
    if (fromUser < toUser ) {
        toPair = toUser + "-"+fromUser;
    }
    console.log(toPair);

    var rs = await dbControl.getAllMessages(toPair);
    
    res.status(200);
    res.send(rs);
})

app.get('/ping', function (req, res) {
    res.send("pong - Fundraising");
})

app.post('/pinatajwt', function (req, res) {
    res.status(200);
    res.send(process.env.PINATAJWT);
})

app.get('/download', function(req, res){
    const file = "./fund.db";
    res.download(file); // Set disposition and send it.
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});