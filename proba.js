// Node.js code to fetch image data from MySQL and render an HTML page with the image
/*
const express = require('express');
const mysql = require('mysql2/promise');
const handlebars = require('handlebars');
const fs = require('fs').promises;

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Route to display the image
app.get('/image', async (req, res) => {
  try {
    // Fetch the image data from the database and convert it to a base64-encoded string
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
    const [rows, fields] = await connection.execute('SELECT image FROM car WHERE idcar = ?', [1]);
    const imageData = Buffer.from(rows[0].image).toString('base64');

    // Render the HTML page with the image data as a variable
    const template = await fs.readFile('proba.html', 'utf8');
    const renderTemplate = handlebars.compile(template);
    const html = renderTemplate({ imageData });
    res.set('Content-Type', 'image/jpeg');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});



const stream = require('stream');

app.get('/images', async (req, res) => {
  try {
    // Get the ID from the query parameter
    const id = req.query.id;

    // Fetch the image data from the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
    const [rows, fields] = await connection.execute('SELECT image FROM renting.car WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).send('Image not found');
      return;
    }

    // Set response headers
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });

    // Send the image data
    const imageData = rows[0].image;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageData);
    bufferStream.pipe(res);
    await new Promise(resolve => bufferStream.on('end', resolve));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

*/

const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Route to display the image
app.get('/image', async (req, res) => {
  try {
    // Fetch the image data from the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
    const [rows, fields] = await connection.execute('SELECT image FROM renting.car');

    // Set response headers
    
    res.writeHead(200, {
      'Content-Type': 'image/png'
     // 'Content-Length': rows[0].image.length
    });

    // Send the image data
    res.end(rows[0].image);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});




app.get('/images', async (req, res) => {
  try {
    // Fetch all image data from the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
    const [rows, fields] = await connection.execute(" select type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor");

    // Convert each image to a base64 string and create an array of objects
    const images = rows.map(row => ({
      typeN: row.typeName,
      model: row.model,
      color: row.colorName,
      price: row.pricePerDay, 
      year: row.year,
      kilemeters: row.kilemeters, 
      data: row.image.toString('base64'),
      type: 'image/png'
    }));

    // Send the array of objects as JSON with the Content-Type header set to application/json
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(images));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

/*const stream = require('stream');

app.get('/images', async (req, res) => {
  try {
    // Fetch the images data from the database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
    const [rows, fields] = await connection.execute('SELECT image FROM renting.car');
    console.log('Number of images fetched:', rows.length);
    // Set response headers
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });

    // Increase the maximum number of listeners allowed for the 'finish' event
    res.setMaxListeners(rows.length + 2);

    // Send each image in parallel
    await Promise.all(rows.map(async (row) => {
      const imageData = row.image;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(imageData);
      bufferStream.pipe(res);
      await new Promise(resolve => bufferStream.on('end', resolve));
    }));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});
*/ 