// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const MyDatabase = await hre.ethers.getContractFactory("Database");
  const myDatabase = await MyDatabase.deploy();

  await myDatabase.deployed();
 
  console.log("Database deployed to:", myDatabase.address);

  let owner;
  let addr1;
  let addr2;
  let addr3;

  [owner, addr1, addr2, addr3, random] = await ethers.getSigners();

  console.log("owner:"+owner.address)
  console.log("addr1:"+addr1.address)
  console.log("addr2:"+addr2.address)
  console.log("addr3:"+addr3.address)

  console.log("owner eth balance:"+(await ethers.provider.getBalance(owner.address)));

  console.log("Database address: "+myDatabase.address);
  await myDatabase.connect(owner).createAccount("Alice");
  console.log("Alice Account Name:"+(await await myDatabase.getUsername(owner.address)));

  await myDatabase.connect(addr1).createAccount("Bob");
  console.log("Bob Account Name:"+(await await myDatabase.getUsername(addr1.address)));

  await myDatabase.connect(addr2).createAccount("Calos");
  console.log("Calos Account Name:"+(await await myDatabase.getUsername(addr2.address)));


  console.log("Alice add Bob as friend");
  await myDatabase.connect(owner).addDefaultFriend(addr1.address);

  console.log("alice friend list");
  console.log(await myDatabase.connect(owner).getMyFriendList());

  console.log("Alice send message to Bob");
  await myDatabase.connect(owner).sendMessage(addr1.address, "Hello");

  console.log("Read Alice message from Bob");
  console.log(await myDatabase.connect(owner).readMessage(addr1.address));

  console.log("Alice create new group");
  await myDatabase.connect(owner).createGroup(random.address, "myGroup1");
  console.log("Alice add Bob into myGroup1");
  await myDatabase.connect(owner).addMemToGroup(random.address, addr1.address);
  console.log("Alice add Calos into myGroup1");
  await myDatabase.connect(owner).addMemToGroup(random.address, addr2.address);

  console.log("Alice send message to myGroup1");
  await myDatabase.connect(owner).sendMessage(random.address, "Hello Group from Alice");

  console.log("Calos send message to myGroup1");
  await myDatabase.connect(addr2).sendMessage(random.address, "Hello Group from Calos");

  console.log("Read Bob message from Group");
  console.log(await myDatabase.connect(addr1).readMessage(random.address));

  // await addr2.sendTransaction({
  //   to: myCrowdSale.address,
  //   // value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
  //   value : 1000000
  // });

  // console.log("addr2 eth balance:"+(await ethers.provider.getBalance(addr2.address)));
  // console.log("addr2 token balance:"+(await myToken.balanceOf(addr2.address)));

  // console.log("addr1 eth balance:"+(await ethers.provider.getBalance(addr1.address)));
  // console.log("We raise:"+ await myCrowdSale.weiRaised() )

  // await myCrowdSale.connect(addr1).completePresale();
  // console.log("addr1 token balance:"+(await myToken.balanceOf(addr1.address)));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });