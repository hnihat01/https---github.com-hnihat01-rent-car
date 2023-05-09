const express=require('express')
const bodyParser = require('body-parser');
const mysql2 = require('mysql2/promise');
const cors = require('cors');
const app=express();
const session = require('express-session');
const path = require('path');

const mime = require('mime');

app.use(express.static(path.join(__dirname, 'login.html')));

app.get('/css/login.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/css/login.css'));
});
app.use(express.static(path.join(__dirname, 'input.html')));

app.get('/css/input.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/css/input.css'));
});
app.use(express.static(path.join(__dirname, 'face.html')));

app.get('/css/first.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/css/first.css'));
});

app.use(express.static(path.join(__dirname, 'welcome.html')));

app.get('/css/search.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, '/css/search.css'));
});

app.use(express.static(path.join(__dirname, 'face.html')));
app.use(express.static(path.join(__dirname, 'welcome.html')));
app.get('/pictures/racing.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/pictures/racing.png'));
});
app.get('/pictures/13.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/pictures/13.jpg'));
});
app.get('/pictures/11.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/pictures/11.jpg'));
});
app.get('/pictures/3.jpeg', (req, res) => {
 res.sendFile(path.join(__dirname, '/pictures/3.jpeg'));

});
app.get('/pictures/car-rental1.png', (req, res) => {
 res.sendFile(path.join(__dirname, '/pictures/car-rental1.png'));
 });


//const encoder= bodyParser.urlencoded();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const{createPool}=require('mysql')
app.use((req, res, next) => {
    res.header( 'Access-Control-Allow-Origin', '*',
    );
    next();
  });


  app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  }));
  
  app.use(express.static('public'));
const pool=createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:'renting',
    connectionLimit:10,
    waitForConnections: true,
    queueLimit: 0
})
module.exports = pool;
//const path = require("path");  
//app.use("/images", express.static(path.join("backend/images")));  


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/input.html');
});
app.post('/input',( req, ress)=>{


 const { name, address, number, password } = req.body;
  // do something with the form data
  console.log(name, address, number);
  pool.query('INSERT INTO customer (name, address,number,password) VALUES (?, ?,?,?)',
  [name, address, number, password], (error, results, fields) => {
    if (error) {
        console.error(error);
        ress.sendStatus(500);
    } else {
        console.log(results);
        ress.sendStatus(200);
    }
});
});

app.post('/update',( req, ress)=>{


  const { name, address, number, password } = req.body;
   // do something with the form data
   console.log(name, address, number);
   pool.query('UPDATE customer  SET  address=?, number=?,password=? WHERE name=? ',
   [ address, number, password, name], (error, results, fields) => {
     if (error) {
         console.error(error);
         ress.sendStatus(500);
     } else {
         console.log(results);
         ress.sendStatus(200);
     }
 });
 
});


app.post('/proba', (req, ress) => {
  const { name, carId, pickup_date, return_date } = req.body;
console.log(name, carId, return_date);
  // Check if the car is available for rent on the given dates
  pool.query(
    'SELECT * FROM renting WHERE idcar = ? AND ((pickup_date <= ? AND return_date >= ?) OR (pickup_date <= ? AND return_date >= ?) OR (pickup_date >= ? AND return_date <= ?))',
    [carId, pickup_date, pickup_date, return_date, return_date, pickup_date, return_date],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        ress.sendStatus(500);
      } else {
        if (results.length > 0) {
          // The car is already rented during the given dates
          ress.status(400).send('The car is not available for rent during the given dates');
        } else {
          // The car is available for rent during the given dates, proceed with the booking
          pool.query(
            'SELECT idcustomer FROM customer WHERE name = ?',
            [name],
            (error, results, fields) => {
              if (error) {
                console.error(error);
                ress.sendStatus(500);
              } else if (results.length > 0) {
                // Get the idcustomer from the results and insert into the renting table
                const idcustomer = results[0].idcustomer;
                pool.query(
                  'INSERT INTO renting (idcustomer, idcar, pickup_date, return_date) VALUES (?, ?, ?, ?)',
                  [idcustomer, carId, pickup_date, return_date],
                  (error, results, fields) => {
                    if (error) {
                      console.error(error);
                      ress.sendStatus(500);
                    } else {
                      console.log(results);
                      ress.sendStatus(200);
                    }
                  }
                );
              } else {
                // The customer name does not exist in the database
                ress.status(400).send('Customer name not found');
              }
            });
        }}
    });
});





app.get('/images', async (req, res) => {
    try {
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
      const [rows, fields] = await connection.execute(" select car.idcar, brand.brandName,type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor  join brand on brand.idbrand=model.idbrand");
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        idcar:row.idcar,
        brandName:row.brandName,
        typeName: row.typeName,
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
  


  app.get('/report', async (req, res) => {
    try {
      const name = req.query.name;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
    
      const [rows, fields] = await connection.execute("SELECT customer.name, customer.address, customer.number, brand.brandName, model.model, car.pricePerDay, renting.pickup_date, renting.return_date FROM renting JOIN car ON car.idcar = renting.idcar JOIN model ON model.idmodel = car.idmodel JOIN brand ON brand.idbrand = model.idbrand JOIN customer ON customer.idcustomer = renting.idcustomer WHERE customer.name=?;",[name]);
  
      // Convert each image to a base64 string and create an array of objects
      const report = rows.map(row => ({
       customerName: row.name,
       address: row.address,
       number: row.number,
       brandName: row.brandName,
       model: row.model,
       pricePerDay: row.pricePerDay,
       pickup_date: row.pickup_date,
       return_date: row.return_date
      }));
  
      // Send the array of objects as JSON with the Content-Type header set to application/json
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(report));
    } catch (err) {
      console.error(err);
      res.status(500).send('Error');
    }
  });
  

app.get('/color', async (req, res) => {
  try {
    const color = req.query.color;
    // Fetch all image data from the database
    const connection = await mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
  
    const [rows, fields] = await connection.execute(" select car.idcar,brand.brandName, type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor  join brand on brand.idbrand=model.idbrand WHERE color.colorName = ?", [color]);

    // Convert each image to a base64 string and create an array of objects
    const images = rows.map(row => ({
      idcar:row.idcar,
      brandName:row.brandName,
      typeName: row.typeName,
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

app.get('/type', async (req, res) => {
  try {
    const type = req.query.type;
    // Fetch all image data from the database
    const connection = await mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'renting'
    });
  
    const [rows, fields] = await connection.execute(" select car.idcar,brand.brandName, type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor  join brand on brand.idbrand=model.idbrand WHERE type.typeName = ?", [type]);

    // Convert each image to a base64 string and create an array of objects
    const images = rows.map(row => ({
      idcar:row.idcar,
      brandName:row.brandName,
      typeName: row.typeName,
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

  app.get('/brand', async (req, res) => {
    try {
      const brand = req.query.brand;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
    
      const [rows, fields] = await connection.execute(" select car.idcar,brand.brandName, type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor  join brand on brand.idbrand=model.idbrand WHERE brand.brandName = ?", [brand]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        idcar:row.idcar,
        brandName:row.brandName,
        typeName: row.typeName,
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


  app.get('/price', async (req, res) => {
    try {
      const price = req.query.price;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
    
      const [rows, fields] = await connection.execute(" select car.idcar,brand.brandName, type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor  join brand on brand.idbrand=model.idbrand WHERE car.pricePerDay = ?", [price]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        idcar:row.idcar,
        brandName:row.brandName,
        typeName: row.typeName,
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


  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });
  app.post('/login', (req, res) => {
    const { name, password } = req.body;
  
    pool.query('SELECT name, password FROM customer WHERE name = ?', [name], async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to login' });
      } else if (results.length === 0) {
        res.json({ success: false, message: 'No user with this username' });
      } else {
        const customer = results[0];
  
        try {
          console.log(password);
          console.log("customer.password",customer.password);
       //   const validPassword = await bcrypt.compare(password, customer.password);
          if (password===customer.password) {
            // Set the Content-Type header to application/json
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, message: 'Login successful' });
          } else {
            res.json({ success: false, message: 'Invalid password' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Failed to compare passwords' });
        }
      }
    });
  });
  
  app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/');

  });
  app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/face.html');

  });
  
  app.get('/dashboard/welcome', (req, res) => {
    res.sendFile(__dirname + '/welcome.html');
  });                                  

  app.get('/rent', (req, res) => {
    res.sendFile(__dirname + '/rent.html');
  });                                  

app.listen(3000,()=>{console.log("listening on port")});
/*

  app.get('/face', (req, res) => {
    res.sendFile(__dirname + '/face.html');
  });
  
  app.post('/customer', (req, res) => {
    const { name, password } = req.body;
  
    pool.query('SELECT name,password FROM customer WHERE name = ?', [name], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to login' });
      } else if (results.length === 0) {
        res.json({ success: false, message: 'No user with this Name' });
      } else if (results[0].password !== password) {
        res.json({ success: false, message: 'Invalid password' });
      } else {
        res.json({ success: true, message: 'Login successful' });
      }
    });
  });
  

      

  app.post('/customer', (req, res) => {
    const { name, password } = req.body;
    pool.query("SELECT name, password FROM renting.customer WHERE name = ? AND password = ?", [name, password], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        if (results.length > 0) {
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "Incorrect username or password" });
        }
      }
    })
  });
  
 // app.get('/', function(request, response) {   response.sendFile(path.join(__dirname + '/login.html'));});
  let nameS = "";
  // Set up a route to handle the form submission
  app.post('/auth', function(request, response) {
    let name = request.body.name;
    let password = request.body.password;
    if (name && password) {
      pool.query('SELECT name, password FROM customer WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.name = name;
          nameS=name;
          response.redirect('/home');
          
        } else {
          response.send('Incorrect Username and/or Password!');
          response.end();
        }
      });
    } else {
      response.send('Please enter Username and Password!');
      response.end();
    }
  });
  
  // Set up a route for the home page
  app.get('/home', function(request, response) {
    if (request.session.loggedin) {
      response.sendFile(path.join(__dirname + '/face.html'));
    } else {
      response.send('Please login to view this page!');
      response.end();
    }
  });
  

app.post('/proba', (req, ress) => {
  const { name,carId, pickup_date, return_date } = req.body;

  // Check if the car is available for rent on the given dates
  pool.query(
    'SELECT * FROM renting WHERE idcar = ? AND ((pickup_date <= ? AND return_date >= ?) OR (pickup_date <= ? AND return_date >= ?) OR (pickup_date >= ? AND return_date <= ?))',
    [carId, pickup_date, pickup_date, return_date, return_date, pickup_date, return_date],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        ress.sendStatus(500);
      } else {
        if (results.length > 0) {
          // The car is already rented during the given dates
          ress.status(400).send('The car is not available for rent during the given dates');
        } else {
          // The car is available for rent during the given dates, proceed with the booking
          pool.query(
            'SELECT idcustomer FROM customer WHERE name = ?',
            [name],
            (error, results, fields) => {
              if (error) {
                console.error(error);
                ress.sendStatus(500);
              } else {
                if (results.length > 0) {
                  // Get the idcustomer from the results and insert into the renting table
                  const idcustomer = results[0].idcustomer;
                  pool.query(
                    'INSERT INTO renting (idcustomer, idcar, pickup_date, return_date) VALUES (?, ?, ?, ?)',
                    [idcustomer, carId, pickup_date, return_date],
                    (error, results, fields) => {
                      if (error) {
                        console.error(error);
                        ress.sendStatus(500);
                      } else {
                        console.log(results);
                        ress.sendStatus(200);
                      }
                    }
                  );
                } else {
                  // The customer name does not exist in the database
                  ress.status(400).send('Customer name not found');
                }
              }
            }
          );
          
        }
      }
    }
  );
});

  app.get('/brand', async (req, res) => {
    try {
      const brand = req.query.brand;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
      const [rows, fields] = await connection.execute("select brand.brandName, model.model, car.image from car join model on model.idmodel=car.idmodel join brand on brand.idbrand=model.idbrand   WHERE brand.brandName = ?", [brand]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        brand: row.brandName,
        model: row.model,
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

  app.get('/type', async (req, res) => {
    try {
      const type = req.query.type;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
      const [rows, fields] = await connection.execute("select type.typeName, model.model, car.image from car join type on type.idtype=car.idtype join model on model.idmodel=car.idmodel   WHERE type.typeName = ? ", [type]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        typeName: row.typeName,
        model: row.model,
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
  }); app.get('/color', async (req, res) => {
    try {
      const color = req.query.color;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
      const [rows, fields] = await connection.execute("select color.colorName,type.typeName, model.model, car.image from car join color on color.idcolor=car.idcolor join type on type.idtype=car.idtype join model on model.idmodel=car.idmodel   WHERE color.colorName = ? ", [color]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        colorName: row.colorName,
        typeName: row.typeName,
        model: row.model,
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
  }); app.get('/price', async (req, res) => {
    try {
      const price = req.query.price;
      // Fetch all image data from the database
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'renting'
      });
      const [rows, fields] = await connection.execute("select car.pricePerDay,color.colorName,type.typeName, model.model, car.image from car join color on color.idcolor=car.idcolor join type on type.idtype=car.idtype join model on model.idmodel=car.idmodel   WHERE car.pricePerDay = ? ", [price]);
  
      // Convert each image to a base64 string and create an array of objects
      const images = rows.map(row => ({
        pricePerDay: row.pricePerDay,
        colorName: row.colorName,
        typeName: row.typeName,
        model: row.model,
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
 

app.get('/car',(req,ress)=>{

  pool.query(" select car.idcar, type.typeName,model.model, color.colorName, car.pricePerDay, car.year, car.kilemeters,car.image from renting.car join type ON type.idtype=car.idtype join model on model.idmodel=car.idmodel join color on color.idcolor=car.idcolor", (err, res)=>{
      ress.send(res)
  })
  // pool.query("SELECT * FROM renting.car order by year;", (err, res)=>{
  //     ress.send(res)
  // })
})

app.get('/custom',(req,ress)=>{

  pool.query("SELECT name, password FROM renting.customer ", (err, res)=>{
      ress.send(res)
  })
})


app.post("/",function(req, res){
var name= req.body.name;
var password= req.body.password;

pool.query('SELECT * FROM customer WHERE name = ? AND password = ?',[name,password], function(error, results, fields){
if(results.length > 0){
  req.session.username = name; // Set the session variable
  res.sendFile(__dirname+"/face.html");
}
else{
 // res.render("login", {message: "Incorrect username or password"});
  res.redirect("/");
}
res.end();
})
})


//app.get("/welcome",function(req, res){res.sendFile(__dirname+"/welcome.html"); })
//when login is succes
  app.get("localhost:3000/welcome",function(req, res){
    if(req.session.username){
      res.sendFile(__dirname+"/proba.html");
    } else {
      res.redirect("/");
    }
  });
  
  app.get('/brand',(req,ress)=>{

    pool.query("SELECT name, password FROM renting.customer ", (err, res)=>{
        ress.send(res)
    })
  })
  

  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  });
  

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let name = request.body.name;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (name && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		pool.query('SELECT * FROM customer WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.name = name;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});



// Set up session middleware
const session = require('express-session');
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Create a new session for the user on successful login
app.post('/login', (req, res) => {
  // Authenticate user and get their user ID
  const userId = authenticateUser(req.body.name, req.body.password);
  if (userId) {
    // Create a new session for the user
    req.session.userId = userId;
    res.redirect('/dashboard');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Check if the user is authenticated on each request to a protected page or feature
app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    // User is authenticated - render the dashboard
    res.render('dashboard');
  } else {
    // User is not authenticated - redirect to login page
    res.redirect('/login');
  }
});

// Destroy the session and log the user out
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
// Set up JWT middleware
const jwt = require('jsonwebtoken');
app.use((req, res, next) => {
  // Get the token from the cookie or local storage
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  // Verify the token and decode the payload
  try {
    const payload = jwt.verify(token, 'my-secret-key');
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).send('Invalid or expired token');
  }
});

// Create a new token for the user on successful login
app.post('/login', (req, res) => {
  // Authenticate user and get their user ID
  const userId = authenticateUser(req.body.username, req.body.password);
  if (userId) {
    // Create a new token for the user
    const token = jwt.sign({ userId }, 'my-secret-key');
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Check if the user is authenticated on each request to a protected page or feature
app.get('/dashboard', (req, res) => {
  if (req.user) {
    // User is authenticated - render the dashboard
    res.render('dashboard');
  } else {
    // User is not authenticated - redirect to login page
    res.redirect('/login');
  }
});

// Destroy the token and log the user out
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});*/