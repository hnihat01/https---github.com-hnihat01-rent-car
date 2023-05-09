const imagesData = [];
const carData = [];

function fetchData(brand) {
  const imagesContainer = document.querySelector('#images-container');
  fetch(`http://localhost:3000/brand?brand=${brand}`)
    .then(response => response.json())
    .then(images => {
      // Clear the images container
      imagesContainer.innerHTML = '';

      // Iterate over the array of image data
      images.forEach(image => {
        // Add the image data to the array
        imagesData.push({
          brand: image.brand,
          model: image.model,
          data: `data:${image.brand};base64,${image.data}`
        });

        // Create an image element
        const img = document.createElement('img');
        // Set the image data as the source of the image element
        img.src = `data:${image.brand};base64,${image.data}`;
        // Append the image element to the container
        imagesContainer.appendChild(img);

        // Create a div element for the other data
        const infoDiv = document.createElement('div');
        // Add the other data to the div element
        infoDiv.innerHTML = `<h2> Brand: ${image.brand}</h2><p>${image.model}</p>`;
        // Append the div element to the container
        imagesContainer.appendChild(infoDiv);

        $('#dialog-overlay').fadeOut();
    $('#dialog-container').fadeOut();
      });
    })
    .catch(error => console.error(error));
}

$(document).ready(function() {

});

  $('#type-open-dialog').click(function() {
    $('#dialog-overlay').fadeIn();
    $('#dialog-container').fadeIn();
  });

  // Close the dialog box when the close button is clicked
  $('#close-dialog').click(function() {
    $('#dialog-overlay').fadeOut();
    $('#dialog-container').fadeOut();
  });

  // Handle clicks on the brand buttons
  $('.brand-button').click(function() {
    const brand = $(this).data('brand');
    fetchData(brand);
  });

// Refresh the page when the button is clicked





function fetchDataType(type) {
const imagesContainer = document.querySelector('#images-container');
fetch(`http://localhost:3000/type?type=${type}`)
  .then(response => response.json())
  .then(images => {
    // Clear the images container
    imagesContainer.innerHTML = '';

    // Iterate over the array of image data
    images.forEach(image => {
      // Add the image data to the array
      imagesData.push({
        typeName: image.typeName,
        model: image.model,
        data: `data:${image.type};base64,${image.data}`
      });

      // Create an image element
      const img = document.createElement('img');
      // Set the image data as the source of the image element
      img.src = `data:${image.type};base64,${image.data}`;
      // Append the image element to the container
      imagesContainer.appendChild(img);
      // Create a div element for the other data
      const infoDiv = document.createElement('div');
      // Add the other data to the div element
      infoDiv.innerHTML = `<h2> type: ${image.typeName}</h2><p>${image.model}</p>`;
      // Append the div element to the container
      imagesContainer.appendChild(infoDiv);

      $('#dialog-overlay-type').fadeOut();
      $('#dialog-container-type').fadeOut();
    });
  })
  .catch(error => console.error(error));
}

$(document).ready(function() {
$('#type-open-dialog-type').click(function() {
  $('#dialog-overlay-type').fadeIn();
  $('#dialog-container-type').fadeIn();
});

// Close the dialog box when the close button is clicked
$('#close-dialog-type').click(function() {
  $('#dialog-overlay-type').fadeOut();
  $('#dialog-container-type').fadeOut();

});

// Handle clicks on the type buttons
$('.type-button').click(function() {
  const type = $(this).data('type');
  fetchDataType(type);
});
});




function fetchDataColor(color) {
const imagesContainer = document.querySelector('#images-container');
fetch(`http://localhost:3000/color?color=${color}`)
  .then(response => response.json())
  .then(images => {
    // Clear the images container
    imagesContainer.innerHTML = '';

    // Iterate over the array of image data
    images.forEach(image => {
      // Add the image data to the array
      imagesData.push({
        colorName:image.colorName,
        typeName: image.typeName,
        model: image.model,
        data: `data:${image.type};base64,${image.data}`
      });

      // Create an image element
      const img = document.createElement('img');
      // Set the image data as the source of the image element
      img.src = `data:${image.type};base64,${image.data}`;
      // Append the image element to the container
      imagesContainer.appendChild(img);
      // Create a div element for the other data
      const infoDiv = document.createElement('div');
      // Add the other data to the div element
      infoDiv.innerHTML = `<h2> color: ${image.colorName}</h2><p>${image.typeName}</p><p>${image.model}</p>`;
      // Append the div element to the container
      imagesContainer.appendChild(infoDiv);

      $('#dialog-overlay-color').fadeOut();
      $('#dialog-container-color').fadeOut();
    });
  })
  .catch(error => console.error(error));
}

$(document).ready(function() {
$('#type-open-dialog-color').click(function() {
  $('#dialog-overlay-color').fadeIn();
  $('#dialog-container-color').fadeIn();
});

// Close the dialog box when the close button is clicked
$('#close-dialog-color').click(function() {
  $('#dialog-overlay-color').fadeOut();
  $('#dialog-container-color').fadeOut();



});

// Handle clicks on the type buttons
$('.color-button').click(function() {
  const color = $(this).data('color');
  fetchDataColor(color);
});
});

function fetchDataPrice(price) {
const imagesContainer = document.querySelector('#images-container');
fetch(`http://localhost:3000/price?price=${price}`)
  .then(response => response.json())
  .then(images => {
    // Clear the images container
    imagesContainer.innerHTML = '';

    // Iterate over the array of image data
    images.forEach(image => {
      // Add the image data to the array
      imagesData.push({
        pricePerDay: image.pricePerDay,
        colorName:image.colorName,
        typeName: image.typeName,
        model: image.model,
        data: `data:${image.type};base64,${image.data}`
      });

      // Create an image element
      const img = document.createElement('img');
      // Set the image data as the source of the image element
      img.src = `data:${image.type};base64,${image.data}`;
      // Append the image element to the container
      imagesContainer.appendChild(img);
      // Create a div element for the other data
      const infoDiv = document.createElement('div');
      // Add the other data to the div element
      infoDiv.innerHTML = `<h2> price: ${image.pricePerDay}</h2><p>${image.colorName}</p><p>${image.typeName}</p><p>${image.model}</p>`;
      // Append the div element to the container
      imagesContainer.appendChild(infoDiv);

      $('#dialog-overlay-price').fadeOut();
      $('#dialog-container-price').fadeOut();
    });
  })
  .catch(error => console.error(error));
}

$(document).ready(function() {
$('#type-open-dialog-price').click(function() {
  $('#dialog-overlay-price').fadeIn();
  $('#dialog-container-price').fadeIn();
});

// Close the dialog box when the close button is clicked
$('#close-dialog-price').click(function() {
  $('#dialog-overlay-price').fadeOut();
  $('#dialog-container-price').fadeOut();



});

// Handle clicks on the type buttons
$('.price-button').click(function() {
  const price = $(this).data('price');
  fetchDataPrice(price);
});
});