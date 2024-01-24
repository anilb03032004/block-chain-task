const express=require('express');
const multer =require('multer');
const cors =require('cors');
const axios =require('axios');
const app=express();
const port=process.env.PORT ||5000;

app.use(express.json())

 const upload=multer({
    limits:{
        fileSize:1000000
    }
 });


 const startonAPI =axios.create({
    baseURL:"https://api.starton.com",
    headers:{
        "x-api-key":"sk_live_28752001-b06d-4d8a-9330-0a93069b65de",
    }
 });
 app.get('/get-cid/:cid', cors(), async (req, res) => {
  const { cid } = req.params;

  try {
    // You can perform any additional logic here if needed
    console.log("Received request to get CID:", cid);

    // Send the CID back in the response
    res.status(200).json({
      cid: cid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



 app.post('/upload',cors(),upload.single('file'),async (req, res) => {
    let data = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    data.append("file", blob, { filename: req.file.originalnam });
    data.append("isSync", "true");
  
    async function uploadImageOnIpfs() {
    
        const ipfsImg = await starton.post("/ipfs/file", data, {
          headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` }
        })
  
        return ipfsImg.data;
      
      
    }
  
    async function uploadMetadataOnIpfs(imgCid) {
      
        const metadataJson = {
          name: `a goof NFT`,
          description: `first NFT I created`,
          image: `ipfs://ipfs/${imgCid}`,
        };
        const ipfsMetadata = await starton.post("/ipfs/json", {
          name: "my first metadata Json",
          content: metadataJson,
          isSync: true,
        })
  
        return ipfsMetadata.data;
      
    }
  
    try {
      const ipfsImgData = await uploadImageOnIpfs();
      const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
      console.log("IPFS Image Data:", ipfsImgData);
      console.log("IPFS Metadata:", ipfsMetadata);
  
      res.status(201).json({
        cid: ipfsImgData.cid
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
 app.listen(port,()=>{
    console.log("serverr is running on port number",port);
 })