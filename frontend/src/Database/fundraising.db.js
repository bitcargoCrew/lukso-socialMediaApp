import {dbCtrl} from '../Database/firebaseCtr';

const createGroup = async (newGroup) => {
    await dbCtrl.setData("groups", newGroup, newGroup.groupId)
			
    await dbCtrl.setData("joingroup", {
        groupId : newGroup.groupId,
        user : newGroup.owner
    }, newGroup.groupId + "|" +newGroup.owner)
}

const filterGroup = async (userAddress, search) => {
    var fullData = await dbCtrl.fetchData("groups");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        if (xdata.name.includes(search.toLowerCase())) {
            var ckJoin = await dbCtrl.getDataById("joingroup", xdata.groupId + "|" + userAddress);
            if (ckJoin) {
                xdata.user = userAddress;
            }
            lsData.push(xdata);
        }
    }
    return lsData;
}


const myGroup = async (userAddress) => {
    var fullData = await dbCtrl.fetchData("groups");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        var ckJoin = await dbCtrl.getDataById("joingroup", xdata.groupId + "|" + userAddress);
        if (ckJoin) {
            lsData.push(xdata);
        }
    }
    return lsData;
}

const joinGroup = async (groupId, user) => {			
    await dbCtrl.setData("joingroup", {
        groupId : groupId,
        user : user
    }, groupId + "|" + user)
}

const newPost = async (post) => {			
    await dbCtrl.setData("posts", post , post.postId)
}

const newCampaign = async (campaign) => {			
    await dbCtrl.setData("campaigns", campaign , campaign.campaignId)
}

const newComment = async (comment) => {			
    await dbCtrl.setData("comments", comment , comment.commentId)
}

const getPosts = async (groupId) => {
    var fullData = await dbCtrl.fetchData("posts");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        if (xdata.groupId == groupId) {
            lsData.push(xdata);
        }
    }
    
    return lsData;
}

const getCampaigns = async (groupId) => {
    var fullData = await dbCtrl.fetchData("campaigns");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        if (xdata.groupId == groupId) {
            lsData.push(xdata);
        }
    }
    return lsData;
}

const getComments = async (postId) => {
    var fullData = await dbCtrl.fetchData("comments");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        if (xdata.postId == postId) {
            lsData.push(xdata);
        }
    }
    return lsData;
}

const setFriend = async (userAddress, friendAddress) => {			
    var user1 = userAddress;
    var user2 = friendAddress;

    if (userAddress > friendAddress) {
        user1 = friendAddress;
        user2 = userAddress;
    }
    await dbCtrl.setData("friends", {
        user1, user2
    } , user1 + "|" + user2)
}

const getFriends = async (userAddress) => {			
    var fullData = await dbCtrl.fetchData("friends");

    var lsData = [];
    for (var e in fullData) {
        var xdata = fullData[e].data;
        if (xdata.user1 == userAddress) {
            lsData.push(xdata.user2);
        } else if (xdata.user2 == userAddress) {
            lsData.push(xdata.user1);
        }
    }
    return lsData;
}

const setMessage = async (fromUser, toUser, message) => {			
    var user1 = fromUser;
    var user2 = toUser;

    if (fromUser > toUser) {
        user1 = toUser;
        user2 = fromUser;
    }

    var currData = await  dbCtrl.getDataById("messages", user1 + "|" + user2);

    if (!currData) {
        currData = []
    } else {
        currData = currData.data
    };
    currData.push({
        fromUser,
        message,
        timestamp : new Date().getTime()
    });
    await dbCtrl.setData("messages", currData ,user1 + "|" + user2);
}

const getMessages = async (fromUser, toUser) => {		
    var user1 = fromUser;
    var user2 = toUser;

    if (fromUser > toUser) {
        user1 = toUser;
        user2 = fromUser;
    }

    var currData = await  dbCtrl.getDataById("messages", user1 + "|" + user2);


    if (!currData) {
        currData = []
    } else {
        currData = currData.data
    };

    return currData;
}

const getChatAccount = async (userAddress) => {
    var currData = await  dbCtrl.getDataById("chatuser", userAddress);
    if (!currData) {
        currData = undefined
    } else {
        currData = currData.data
    };
    return currData;
}

const setChatAccount = async (userAddress, chatPublicKey) => {
    await dbCtrl.setData("chatuser", chatPublicKey , userAddress)
}

export const fundraisingDb = {
    createGroup,
    filterGroup,
    myGroup,
    joinGroup,
    newPost,
    newCampaign,
    getCampaigns,
    getPosts,
    newComment,
    getComments,
    setFriend,
    getFriends,
    setMessage,
    getMessages,
    getChatAccount,
    setChatAccount
}