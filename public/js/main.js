

populatelist();

function  populatelist(){
    console.log("Called")
    fetch('/openai/imageList')
  .then(res => res.json())
  .then(images => {
    const container = document.getElementById('imageList');
    container.innerHTML="";
    images.forEach(imageUrl => {
      const listItem = document.createElement("li");
      const img = document.createElement('img');
      const name = document.createElement('p')
      img.src = imageUrl;
      img.className = 'pastimg';

      name.textContent = imageUrl.split('/').pop().split('.').shift();
      listItem.appendChild(img);
      listItem.appendChild(name);
      container.appendChild(listItem);
      img.addEventListener('click', () => {
        document.querySelector('#image').src =img.src;
        document.querySelector('.msg').textContent = name.textContent;
        console.log("finished")    
    })

    });
  })
  .catch(error => {
    console.error(error);
  });
}



function onSubmit(e){
    e.preventDefault();

    document.querySelector('.msg').textContent ="";
    document.querySelector('#image').src ='placeholder.jpg';
    
    const prompt= document.querySelector("#prompt").value;
    const size= document.querySelector("#size").value;

    if(prompt === '' || size ===''){
        alert("Please add some text");
        return;
    }

    //console.log(prompt,",", size);

    
    generateImageRequest(prompt,size);

}

//Call to an endpoint for image generation
async function generateImageRequest(prompt , size){
    try {
        showSpinner();
        //Now POST request using fetch to endpoint
        const response = await fetch('/openai/image', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                size,
            }),
        });

        if(!response.ok){
            removeSpinner();
            throw new Error('That image couldnt be generated');
        }

        const data = await response.json();
        console.log(data, data.data);
       // document.querySelector('.msg').textContent = data.prompt + data.size;
        document.querySelector('#image').src =data.data;
        setTimeout(function(){
            populatelist();
            }, 5000);
        removeSpinner();
        

    } catch (error) {
        document.querySelector('.msg').textContent = error;
        
    }

}


function showSpinner(){
    document.querySelector('.overlay').classList.remove('hide');
}
function removeSpinner(){
    document.querySelector('.overlay').classList.add('hide');
}

document.querySelector("#image-form").addEventListener('submit', onSubmit);


