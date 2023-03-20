const fs = require('fs');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const generateImage = async (req,res)=>{
    const { prompt, size}= req.body;

    const imageSize = size === 'small' ?'256x256':size === 'medium'? '512x512':'1024x1024';
    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: imageSize,
        });
        const imageUrl = response.data.data[0].url;
        saveImageFile(imageUrl,prompt);

        res.status(200).json({
            success : true,
            data :imageUrl,
        });
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        res.status(400).json({
            success: false,
            error: 'The image couldnt be generated'
        });  
    }
};

function saveImageFile(imageUrl,prompt){

   // const imageUrl = 'https://th.bing.com/th/id/R.bbbe70bf8ba61ecdb327e0f7eaad5187?rik=WLtFSYcihLcbXg&riu=http%3a%2f%2ffindicons.com%2ffiles%2ficons%2f615%2fthundercats%2f256%2fthe_eye_of_thundera.png&ehk=RbAK8wSuUNW3yuCTZ3hoO76VUYypgQFVehs3RmAh9i8%3d&risl=&pid=ImgRaw&r=0';
   //const imgDir = path.join(__dirname, '../public/img');
   
   // const filePath = `${imgDir}/${prompt}.png`;
    const filePath = `./public/img/${prompt}.png`;
    console.log(filePath)
    
    fetch(imageUrl)
    .then(res => res.blob())
    .then(blob => blob.arrayBuffer())
    .then(buffer => fs.writeFileSync(filePath, Buffer.from(buffer)))
      .catch(error => {
        console.error("insaveimagefile",error);
      });
}

module.exports = {generateImage};