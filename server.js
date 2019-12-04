const express = require('express');
const app = express();
const fs = require('fs');
const formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const mongourl = 'mongodb+srv://albert:albertlai@s12117948-nxlom.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'Project';
var bodyParser = require('body-parser')

app.set('view engine', 'ejs');

var restaurant = {
      name : ' ' ,
      borough : '',
      cuisine : '', 
      street : '',
      building : '',
      zipcode : '',
      latitude : '',
      longitude : '',
      owner : '' ,
	rate: ''
};

var user = {
      name : ' ' ,
      password : '',
};

app.get('/', function(req,res) {
    res.render('login');
});


app.get('/createac', function(req,res) {
    res.render('createac');
});

app.get('/upload',(req,res) => {
    res.render('upload');
});

app.get('/rate/:name',(req,res) => {
     let listname = req.params.name;
      const client = new MongoClient(mongourl);
       client.connect((err) => {
       assert.equal(null,err);
       const db = client.db(dbName);

   let cursor = db.collection('restaurant').find({'name' : listname });
   
        cursor.toArray((err,doc) => {
    
res.render('rate.ejs', {restaurant : doc})
})
 });
});

//Search the restaurant by name
  app.get('/search', (req, res)=>  {
  var name = req.query.name;
console.log(restaurant.name);
     const client = new MongoClient(mongourl);
     client.connect((err) => {
     assert.equal(null,err);
     console.log("Connected successfully to mongodb server");
     const db = client.db(dbName);
     let cursor = db.collection('restaurant').find({'name' : name });
       cursor.toArray((err,doc) => {
       console.log(`No. of document to render : ${doc.length}`)
       res.render('restaurant.ejs', {restaurant : doc})
   })
  });

});

app.get('/update/:name',(req,res) => {
     let listname = req.params.name;
    console.log("start",listname );
      const client = new MongoClient(mongourl);
       client.connect((err) => {
       assert.equal(null,err);
       console.log("Connected successfully to mongodb server");
       const db = client.db(dbName);

   let cursor = db.collection('restaurant').find({'name' : listname });
   
        cursor.toArray((err,doc) => {
         console.log(`No. of document to render : ${doc.length}`)
res.render('update.ejs', {restaurant : doc})
})
 });
});





app.get('/delete',(req,res) => {
    res.render('delete');
});


//get the list page

app.get('/list',(req,res) => {
 const client = new MongoClient(mongourl);
       client.connect((err) => {
       assert.equal(null,err);
       const db = client.db(dbName);
         let cursor = db.collection('restaurant').find({});
         cursor.toArray((err,doc) => {
         res.render('list', {restaurant : doc});         
   });
  });
});


app.get('/upload',(req,res) => {
    res.render('upload');
});


//create restaurant documents
app.post('/upload', function(req,res){
       var form = new formidable.IncomingForm();
        form.parse(req,(err,fields,files) => {
        restaurant.name = fields.name;
        restaurant.borough = fields.borough;
        restaurant.cuisine = fields.cuisine;
        restaurant.street = fields.street;
        restaurant.building = fields.building;
        restaurant.zipcode = fields.zipcode;
        restaurant.latitude = fields.latitute;
        restaurant.longitude = fields.longitude;
        restaurant.owner = fields.owner;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            const db = client.db(dbName);
            db.collection('restaurant').insertOne(restaurant,(err, result) => {
                assert.equal(err, null);
                client.close();
            });
        });
    });
  res.redirect('/list');  
});



//Display the restaurant record

app.get('/restaurant/:name', function(req, res) {
     let listname = req.params.name;
      const client = new MongoClient(mongourl);
       client.connect((err) => {
       assert.equal(null,err);
       const db = client.db(dbName);

   let cursor = db.collection('restaurant').find({'name' : listname });
   
        cursor.toArray((err,doc) => {
res.render('restaurant.ejs', {restaurant : doc})
})
 });
});

//Create user Account
app.post('/createac', function(req,res){
   var form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files) => {
        console.log(fields.name);
        user.name = fields.name;
        user.password = fields.password;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to mongodb server");
            const db = client.db(dbName);
            db.collection('user').insertOne(user,(err, result) => {
                assert.equal(err, null);
                console.log("1 document inserted.");
                client.close();
            });
        });
    });
   res.redirect('/');
});


//Delete Restaurant record
app.get('/delete/:name', function(req,res){
let listname = req.params.name;
console.log("start delete",listname );
      const client = new MongoClient(mongourl);
       client.connect((err) => {
       assert.equal(null,err);
       console.log("Connected successfully to mongodb server");
       const db = client.db(dbName);
	db.collection('restaurant').deleteOne({'name' : listname });
	});
 res.redirect('/delete');

});

//Update the restaurant
app.post('/update/:name', function(req,res){
   let listname = req.params.name;
	var form = new formidable.IncomingForm();
        form.parse(req,(err,fields,files) => {
        restaurant.borough = fields.borough;
        restaurant.cuisine = fields.cuisine;
        restaurant.street = fields.street;
        restaurant.building = fields.building;
        restaurant.zipcode = fields.zipcode;
        restaurant.latitude = fields.latitute;
        restaurant.longitude = fields.longitude;
        restaurant.owner = fields.owner;	
 console.log(restaurant.name,restaurant.borough,restaurant.cuisine,restaurant.street,restaurant.building, );
console.log("start update",listname );
     const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to mongodb server");
            const db = client.db(dbName);
     console.log(restaurant.name,restaurant.borough,restaurant.cuisine,restaurant.street,restaurant.building, );


	db.collection('restaurant').updateOne({'name' : listname },
		{$set : {
              	'borough'   :  restaurant.borough ,      
        	"cuisine"  :  restaurant.cuisine,
       		"street"  :  restaurant.street,
       		"zipcode"  :  restaurant.zipcode,
       		"latitude"  :  restaurant.latitude,
        	"longitude "  :  restaurant.longitude,
        	"owner "  :  restaurant.owner} });
	});
	client.close();
});	
 res.redirect('/list');
});


//Rate the restaurant
app.post('/rate/:name', function(req,res){
    let listname = req.params.name;    
    var form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files) => {
        console.log(fields.name);
        restaurant.rate = fields.score;
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            assert.equal(null,err);
            console.log("Connected successfully to mongodb server");
            const db = client.db(dbName);
console.log(restaurant.rate );
            db.collection('restaurant').updateOne({'name' : listname},  {$set: {'rate' : restaurant.rate } });
                assert.equal(err, null);
                console.log("rate updated.");
                
        });
    });
  res.redirect('/list');
});

//listen to the localhost 
app.listen(process.env.PORT || 8099);
