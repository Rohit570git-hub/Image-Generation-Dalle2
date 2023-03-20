const express = require('express');
const {generateImage} = require('../controllers/openaiController');
const router = express.Router();

const fs = require('fs');
const path = require('path');


router.post('/',(req,res)=>{
    
    const {prompt, size}= req.body;
    console.log(prompt,size);
    const imageSize = size === 'small' ?'256x256':
    size === 'medium'? '512x512':'1024x1024';
    res.status(200).json({
        success : true,
        size : imageSize,
        prompt :prompt,
    });
})

router.get('/imageList', (req, res) => {
    const imgDir = path.join(__dirname, '../public/img');
    fs.readdir(imgDir, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
      }
      const images = files.filter(file => file.endsWith('.png'))
                            .map(file => `/img/${file}`);
      res.send(images);
    });
  });

router.post('/image',generateImage);

module.exports=router;