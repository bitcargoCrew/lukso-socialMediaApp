// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Fundraiser is Ownable {
  using SafeMath for uint256;

  struct Donation {
    uint256 value;
    uint256 date;
  }

  struct Campaign {
    address campaignId;
    address groupId;
    address payable beneficiary;
    uint256 goalAmount; // goalAmount = 0: unlimited donation
    uint256 totalDonations;
    uint256 donationsCount;
    uint256 withdrawedAmount;
    uint256 deadline;
  }

  mapping(address => Donation[]) private _donations; //campaignId => Donation
  mapping(address => Campaign) private _campaigns;

  mapping(address => address[]) private _ownerCampaignId;

  function myDonationsCount(address campaignId) public view returns (uint256) {
    return _donations[campaignId].length;
  }

  function createCampaign(
    address campaignId,
    address groupId,
    uint256 goalAmount,
    uint256 deadline
    ) public {

    require(_campaigns[campaignId].beneficiary == address(0), "The campaign existed");

    _ownerCampaignId[msg.sender].push(campaignId);

    _campaigns[campaignId] = Campaign(
      campaignId,
      groupId,
      payable(msg.sender),
      goalAmount,
      0,
      0,
      0,
      deadline
    );

  }

  function viewCampaign(address campaignId) public view returns (Campaign memory) {
    Campaign memory item = _campaigns[campaignId];
    return item;
  }

  function viewAllMyCampaignId(address myAddress) public view returns (address[] memory){
    return _ownerCampaignId[myAddress];
  }

  // function viewAllMyCampaigns() public view returns (Campaign[] memory){
  //   address[] memory myCListId = _ownerCampaignId[msg.sender];
  //   Campaign[] memory rs;

  //   for(uint i=0; i<myCListId.length; ++i)
  //   {
  //     rs.push(_campaigns[myCListId[i]]);
  //   }
  //   return rs;
  // }

  function donate(address campaignId) public payable {

    require(block.timestamp < _campaigns[campaignId].deadline, "The campaign finished");

    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp
    });

    if (_campaigns[campaignId].goalAmount > 0) {
      require(_campaigns[campaignId].totalDonations < _campaigns[campaignId].goalAmount , "The goal has been reached");
    }
    
    _donations[campaignId].push(donation);
    _campaigns[campaignId].totalDonations = _campaigns[campaignId].totalDonations.add(msg.value);
    _campaigns[campaignId].donationsCount = _campaigns[campaignId].donationsCount + 1;
  }

  function viewDonations(address campaignId) public view returns (
      uint256[] memory values,
      uint256[] memory dates
  )

  {
    uint256 count = myDonationsCount(campaignId);
    values = new uint256[](count);
    dates = new uint256[](count);
    for (uint256 i = 0; i < count; i++) {
        Donation storage donation = _donations[campaignId][i];
        values[i] = donation.value;
        dates[i] = donation.date;
    }
    return (values, dates);
  }

  function withdraw(address campaignId) public {
    require(_campaigns[campaignId].beneficiary == msg.sender, "You are not the campaign creator");

    uint256 fullBalance = address(this).balance;
    uint256 restToWidthraw = _campaigns[campaignId].totalDonations - _campaigns[campaignId].withdrawedAmount;

    // if (balance > _campaigns[campaignId].totalDonations) {
    require(restToWidthraw > 0, "Nothing to widthraw");

    require(fullBalance >= restToWidthraw, "Something wrong in the balance of the contract");
    
    _campaigns[campaignId].withdrawedAmount = _campaigns[campaignId].totalDonations;

    _campaigns[campaignId].beneficiary.transfer(restToWidthraw);
  }

  function withdrawAllandStop(address campaignId) public {
    withdraw(campaignId);
    _campaigns[campaignId].deadline = block.timestamp;
  }

  // fallback() external payable {
  //     totalDonations = totalDonations.add(msg.value);
  //     donationsCount++;
  // }

}