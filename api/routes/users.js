var express = require('express');
var router = express.Router();

/* GET users listing. */
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://manish123:manish123@cluster0-o3prk.mongodb.net/students?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology:true});

var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {

     console.log('db connected...!');

     //dummy route for fetching all data
     router.get('/testing', function(req, res, next) {
      connection.db.collection("collection01", function(err, collection){
        collection.find({}).toArray(function(err, data){
            res.json(data); // it will print your collection data
        })
    });
  });

  //add route to generate 1000 dummy data of students
router.post('/add', (req, res, next) => {
var student = [];
for (var i=0; i<1000; i++) {
    student[i] = {
        name: "name" + i+1,
        marks: Math.floor(Math.random() * 100) + 1 ,
        roll_no: i+1,
        parents_salary_in_lakh: Math.floor(Math.random() * 10) + 1 
    };
}
  connection.db.collection("collection01", function(err, collection){
    collection.insertMany(student , (function(err, data){
        res.json(data); // it will print your collection data
    }))
  });
});



//route to get avg student marks where parents salary is greater than 5lpa
router.get('/getdata', function(req, res, next) {
  connection.db.collection("collection01", function(err, collection){
    collection.aggregate([
    {
      $match : { "parents_salary_in_lakh": { $gte: 5, $lt: 10 } }
    },
      {   
        $group:
          {
            _id: null,
            avgMarks: { $avg: "$marks"}
          }
      }
    ]).toArray(function(err, data){
        res.json(data); // it will print your collection data
    })
});
});

//route to get avg student marks where parents salary is less than 5lpa
router.get('/getdatabelow', function(req, res, next) {
  connection.db.collection("collection01", function(err, collection){
    collection.aggregate([
    {
      $match : { "parents_salary_in_lakh": { $gte: 1, $lt: 5 } }
    },
      {   
        $group:
          {
            _id: null,
            avgMarks: { $avg: "$marks"}
          }
      }
    ]).toArray(function(err, data){
        res.json(data); // it will print your collection data
    })
});
});

});

module.exports = router;
