![Bitvia](./frontend/public/bitvia_blue.png "Bitvia")
=======================================

# Bitvia, one DApp to Build and Grow powerful Web3 Communities in a decentralized way

On Bitvia you will find everything you need to connect to your fans, interact with them and let them support you. Powered by the possibilities of Web3, you have all the tools at your disposal to expand your fan base and distribute your ideas. No matter where you are on your creative journey, there should be no boundaries. Enjoy complete creative control.

Check it out: Youtube link here!

# Documentation

* [Team](#team)
* [Getting Started](#getting-started)
  - [General architecture](#general-architecture)
  - [Smart Contract](#smart-contract)
  - [Frontend](#frontend)
  - [Universal Profile](#universal-profile)
* [Private Data Manipulation](#private-data-manipulation)
  - [End-to-End Encryption Chat app](#end-to-end-encryption-chat-app)
  - [Data stored in Firebase](#data-stored-in-Firebase)
* [Road Map](#road-map)


# Team

Sandro Rüttimann - sr_social@outlook.com

Roger Heines - roger.heines@gmail.com

Van Thanh Le - levanthanh3005@gmail.com

# Getting Started

## General architecture

![Architecture](./frontend/public/fundraising.drawio.png "Architecture")

We store private data in our encrypted private database, for example, the data from the chat app and the information from the private groups. Other general information that needs to be public and traceable is stored in the Lukso blockchain via a smart contract transaction. This secures all private data, while the activities from the fundraising process can be tracked publicly.

We use the following parts of the Lukso Blockchain:

- Integration of Universal Profiles (UPs) for the Login
- Show the assets of a UP in the application
- Send LXYe token between UPs
- Send a token (LSP7) to another UP
- Send an NFT (LSP8) to another UP
- Token-based access to a private group
- Use LXYe tokens to fund a campaign (fundraising campaign)
- Interaction with UniversalPage to mint tokens and NFTs
- End-to-end encryption of the chat app

## Smart contract

Our smart contract is developed and tested carefully in [here](/smartcontract).
If you want to redeploy a smart contract, your new contract address should be updated in [config](/frontend/src/Common/config.js)

## Frontend


### Prepare the .env file

The .env template is as follows:

```bash
REACT_APP_PINATAJWT=
REACT_APP_FIREBASE_APIKEY=
REACT_APP_FIREBASE_AUTHDOMAIN=
REACT_APP_FIREBASE_PROJECTID=
REACT_APP_FIREBASE_STORAGEBUCKET=
REACT_APP_FIREBASE_MESSAGINGSENDERID=
REACT_APP_FIREBASE_APPID=
REACT_APP_FIREBASE_MEASUREMENTID=
```

- [Pinata](https://www.pinata.cloud/): you can create free account with 1GB of storage
- [Firebase](https://firebase.google.com/): offers a no-cost tier pricing plan for all its products. We create a Cloud Firestore and then connect to it.

### Install the dependencies and run the development server

```bash
npm install
npm start
# or
yarn
yarn start
```

### Or run with Docker

Build docker image:

```bash
docker build -t fundraisingfrontend .
#Run and debug:
docker run -d \
  -p 3000:3000 \
  --name fundraisingfrontend \
  fundraisingfrontend
```

# Private Data Manipulation
## End-to-End Encryption Chat app
Messages should be encrypted and only the recipient should be able to decrypt the message. We use the UP for the end-to-end encryption/decryption.

1. We started with the idea of using the user signature (132 bytes long) for end-to-end encryption/decryption.
2. The user signature was converted into a private key (32 bytes long) using the sha3 algorithm.
3. We have generated a public key from the private key, which we will use as the user's public key in our chat app.
4. Finally, we stored the public key that is linked to the user Lukso's address in Firebase.

![Signature To Account](./documentation/SignatureToAccount.drawio.png "Signature To Account")

Before a user can chat, the person must sign the message so that a public and a private key for the chat app is created. The private key is used for the decryption and and public key is used for the encryption of the message. In the database, only the public key is stored, and the encrypted content. To chat with a friend, both users must join the chat app so that our database can match the public keys and only these two people can decrypt the message.

This is an example of what we store inside Firebase:

![Message sample](./documentation/message-picture.png "Message sample")

In our chat app, each message will be encrypted for both sender and receiver, so both users can read it.

Source for the idea of using the UP for end-to-end encryption: Felix Hildebrandt via Discord.

## Data stored in Firebase

Besides the encrypted data from the chat app, we also keep all data from the fundraising application with groups, posts, comments, and fundraisings in Firebase.

Currently, all this data is not encrypted and is only protected by Cloud Firestore's access management and authentication. For public groups, we think this is acceptable, but restricted groups are only blocked by a simple method, so there is still room for improvement and discussion.

## Discussion

With the UP end-to-end encryption method, we can guarantee that the message is only read by the sender and receiver. This method is very simple and lightweight, and we only need Firebase to store the encrypted data.

In the case of a restricted group, we can of course proceed in a similar way, but we must encrypt the data for each member. In this way, the amount of data could become enormous, which reduces the loading capacity of the database. In addition, the new member in this type of group cannot read the previous messages. So in the future, we could consider another lightweight encryption solution, where storing the group's private key in the database could be a quick way.

# RoadMap

Phase 1: Add more Core Features

- Profile Management: Allow users to create and manage their own profiles in Bitvia
- Social Media Feed: Develop a basic feed system for users to post and interact with content
- Fundraising Campaign Creation: Enable users to create crowdfunding campaigns with more details

Phase 2: Enhanced User Experience

- Media Upload and Sharing: Allow users to upload and share various types of media, such as images and videos
- Community Forums: Add discussion forums to encourage community interaction and support
- Real-time Notifications: Integrate real-time notifications for actions like likes, comments, and campaign update
- Enhanced Campaign Management: Expand campaign management features
- Extended Crowdfunding Features: Introduce advanced crowdfunding options, like flexible funding models, stretch goals, and equity crowdfunding
- Collaboration Features: Implement features to facilitate collaboration between users on projects and campaigns

Phase 3: Security and Compliance

- Security: Add more layers for encryption to ensure user data and transactions are secured end-to-end
- Compliance with Regulations: Compliance with Regulations
- Bug Fixes and Stability: Address any security vulnerabilities, bugs, and stability issues
