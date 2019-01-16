var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/',(req,res,next)=>{
  res.redirect('/category/1');
})

router.get('/:id', function(req, res, next) {
  let page = req.params.id;
  if(page<=0) res.redirect('/category/1');
  else {
    db = res.app.locals.db;
    db.collection('category').find({}).limit(20).skip(page*20-20).toArray((err,result)=>{
      if(err) throw err;
      console.log(result);
      res.render('category',{categoryData:result});
    })
  }
});

router.post('/add', function(req, res, next) {
  let data = req.body;
  let timeCreate = new Date();
  data.timeCreate = timeCreate.toLocaleDateString();
  db = res.app.locals.db;
  db.collection("category").insertOne(data, (err, result) => {
    if(err) throw err;
    data._id=result.insertedId;
    // console.log(result)
    res.send(data);
    res.end()
  })

});

router.post('/search', (req, res) => {
  var infor = new Object();
  if(req.body.Name)
    infor.Name= new RegExp(req.body.Name);
  if(req.body.Description)
    infor.Description=new RegExp(req.body.Description);
  if(req.body.CategoryID)
    infor.CategoryID=new RegExp(req.body.CategoryID);
  if(req.body.FAirNetID)
    infor.FAirNetID=new RegExp(req.body.FAirNetID);
  if(req.body.DataSheet)
    infor.DataSheet=new RegExp(req.body.DataSheet);
  db.collection("device").find(infor).limit(10).toArray(function (err, data) {
    if (err) throw err;
    console.log(data)
    res.send(JSON.stringify(data));
    res.end();
  });
});

router.post("/addMore", (req, res, next) => {
    let id = req.body._id;
    let newValue = req.body.newValue;
    console.log(req.body);
    db = res.app.locals.db;
    db.collection("category").updateOne({_id: ObjectID(id)},{$push:{list:newValue}},(err,result)=>{
        if (err) throw err;
        // console.log(id);
        res.end();
    })
})

router.post("/delete", (req, res, next) => {
  let id = req.body._id;
  // console.log(id);
  db = res.app.locals.db;
  db.collection("category").deleteOne({_id: ObjectID(id)},(err, result) => {
    if (err) throw err;
    // console.log(id);
    res.end();
  });
})


router.post("/edit", (req, res, next) => {
  let newData = req.body;
  let id = newData._id;
  delete newData._id;
  let timeEdit = new Date();
  newData.timeEdit = timeEdit.toLocaleDateString();
  db = res.app.locals.db;
  // console.log(newData);
  db.collection("category").updateOne({_id: ObjectID(id)},{$set:newData},{upsert:true},(err, result) => {
    if (err) throw err;
    res.end();
  });
})

module.exports = router;
