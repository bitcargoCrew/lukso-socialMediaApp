const axios = require('axios')
const FormData = require('form-data')
// const fs = require('fs')
import {config} from "./config";

export async function pinFileToIPFS (file) {
    const formData = new FormData();

    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
        // get JWT

        var response = await axios.post(config.DATABASE+'/pinatajwt', {
          userAddress: "userAddress26"
        });

        var JWT = "Bearer "+response.data;

        // done JWT

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: JWT
            }
        });

        return res.data;
    } catch (error) {
      console.log(error);
    }
}