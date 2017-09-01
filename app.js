var express = require('express');
var app = express();
var path = require('path');

//Creating Router() object
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/';
var db;
var quotesResults;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, database) {
    if(err) console.log(err)

    db = database;
    console.log("Connected correctly to server");
    app.listen(1337, function() {
        console.log("Running at Port 1337");
    });

});



var bodyParser = require('body-parser');
// urlencoded tells body-parser to extract data from <form> element
// add them to the body property in the request object
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine to hbs
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({defaultLayout: '', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.get('/', function(req, res){
// do something
// Note: __dirname is directory that contains
// the JavaScript source code.
    res.sendFile(__dirname + '/index.html');
});


app.post('/quotes', function(req, res){
    console.log(req.body);
    insertQuote(req, res);
});


app.get('/delete/:id', function(req, res){
    console.log(req.body);
    deleteQuote(req, res);
});

app.get('/edit/:id', function(req, res){
    console.log(req.body);
    editQuote(req,res);
});

app.post('/edit/:id', function(req, res){
    console.log(req.body);
    updateQuote(req,res);

});

app.get('/home', function(req, res){
    res.render('pages/index');
});
app.get('/quotes', function(req, res){
    getQuote(req, res);
});



// Tell express to use this router with '/' before.
// You can put just '/' if you don't want any sub path before routes.
app.use("/", router);

app.use(function(err,req,res,next) {
    console.log(err.stack);
    res.status(500).send({"Error" : err.stack});
});


// last middleware - handle 404 error
app.use("*", function(req, res){
    res.status(404).send('404');
});

// listen on this port
// viewed at http://localhost:1337

function insertQuote(req, res) {
// Get the documents collection
    var collection = db.collection('quotes');
    collection.insertOne(req.body, function(err, result) {
        if (err)
            return console.log(err);
        console.log('saved to mongoDB');
        res.redirect('/quotes');
    });
}
function getQuote(req, res) {
    var collection = db.collection('quotes');
    collection.find().toArray(function(err, results) {
        console.log(results);
// send HTML file populate with quotes here
        quotesResults = results;
// renders index.ejs
        res.render('../views/pages/quotes', { quotes: quotesResults});
    });
}

function  deleteQuote(req,res) {

    var id = req.params.id;
    var objectId = new ObjectID(id);
    var collection = db.collection('quotes');
    collection.deleteOne( {  "_id" : objectId } );
    getQuote(req,res);

}

function  editQuote(req,res) {

    var id = req.params.id;
    var objectId = new ObjectID(id);
    var collection = db.collection('quotes');
    collection.find( { "_id" : objectId } ).toArray(function(err, results) {
        console.log(results);
    // send HTML file populate with quotes here
        quotesResults = results;
    // renders index.ejs
        res.render('../views/pages/edit-quote', { quotes: quotesResults});
    });

    //res.send(id);

}


function  updateQuote(req,res) {

    var id = (req.params.id) ;
    var collection = db.collection('quotes');
    var name=req.body.name;
    var quote=req.body.quote;

    var objectId = new ObjectID(id);

   /* collection.find( { _id: objectId } ).toArray(function(err, results) {
        console.log(results);
        // send HTML file populate with quotes here
        quotesResults = results;
        // renders index.ejs
       // res.send(quotesResults);
    });*/

    collection.updateOne(
        { "_id" : objectId },
        { $set: { "name" : name , "quote": quote } });

    getQuote(req,res);
}