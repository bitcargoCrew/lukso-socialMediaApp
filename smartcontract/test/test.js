// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const BigNumber = hre.ethers.BigNumber;

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {

  let myDatabase;
  let myAsset;
  let owner, addr1, addr2, addr3, addr4, addr5, random;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    const MyFundraiser = await hre.ethers.getContractFactory("Fundraiser");
    myFundraiser = await MyFundraiser.deploy();

    [owner, addr1, addr2, addr3, addr4, addr5, random] = await ethers.getSigners();

  });

  // You can nest describe calls to create subsections.
  describe("Basic function", function () {

    it("Create a campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  0, new Date("01/01/2500").getTime() / 1000);
      // console.log(await myFundraiser.connect(addr1).viewCampaign(addr2.address));
      expect((await myFundraiser.connect(addr1).viewCampaign(addr2.address)).image == "image1");
    });

    it("Add fund for campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  0, new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("1") })

      // console.log(await myFundraiser.connect(addr1).viewCampaign(addr2.address));

    })

    it("Reach the goal of campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  ethers.utils.parseEther("1"), new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("1") })

      await expect(myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("1") })).to.be.revertedWith("The goal has been reached");
    })

    it("Withraw money from the unlimited campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  0, new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("2") })

      const beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdraw(addr2.address);

      const afterWidthraw = await ethers.provider.getBalance(addr1.address);

      // console.log("Changes:", parseInt ((afterWidthraw - beforeWidthraw) *100 / (2 *  10 ** 18)) == 99)
      expect ( parseInt ((afterWidthraw - beforeWidthraw) *100 / (2 *  10 ** 18))).to.equal(99)
    })

    it("Withraw money 2 times with unlimited campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  0, new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("2") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdraw(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);

      // console.log("Changes:", parseInt ((afterWidthraw - beforeWidthraw) *100 / (2 *  10 ** 18)) == 99)
      

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("3") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdraw(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);

      // console.log("Changes:", parseInt ((afterWidthraw - beforeWidthraw) *100 / (3 *  10 ** 18)) == 99)
    })

    it("Withraw money 2 times with limited campaign", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  ethers.utils.parseEther("5"), new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("2") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdraw(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);

      // console.log("Changes:", parseInt ((afterWidthraw - beforeWidthraw) *100 / (2 *  10 ** 18)) == 99)
      

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("3") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdraw(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);

      // console.log("Changes:", parseInt ((afterWidthraw - beforeWidthraw) *100 / (3 *  10 ** 18)) == 99)
    })

    it("Withraw all and stop", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  0, new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("2") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdrawAllandStop(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);      

      await expect(myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("3") })).to.be.revertedWith("The campaign finished");
    })

    it("Withraw all and stop with limited fund", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  ethers.utils.parseEther("5"), new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("2") })

      var beforeWidthraw = await ethers.provider.getBalance(addr1.address);


      await myFundraiser.connect(addr1).withdrawAllandStop(addr2.address);

      var afterWidthraw = await ethers.provider.getBalance(addr1.address);      

      await expect(myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("3") })).to.be.revertedWith("The campaign finished");
    })

    it("Reach the goal of campaign v2", async function () {
      await myFundraiser.connect(addr1).createCampaign(addr2.address,addr2.address,  ethers.utils.parseEther("1"), new Date("01/01/2500").getTime() / 1000);

      await myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("1.0") })
      await expect(myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("0.6") })).to.be.revertedWith("The goal has been reached");

      // await expect(myFundraiser.connect(addr2).donate(addr2.address, { value: ethers.utils.parseEther("1") })).to.be.revertedWith("The goal has been reached");

      // await expect(myDatabase.connect(owner).addMemToGroup(myAsset.address, addr2.address)).to.be.revertedWith("Your friend does not have enough asset to be added in this group");

    })
  });
});