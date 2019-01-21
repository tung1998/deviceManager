var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/',(req,res,next)=>{
  res.redirect('/device/1');
})

router.get('/:id', function(req, res, next) {
  let page = req.params.id;
  if(page<=0) res.redirect('/device/1');
  else {
    db = res.app.locals.db;
    db.collection('device').find({}).limit(20).skip((page-1)*20).toArray((err,result)=>{
      if(err) throw err;
      let data={
        deviceData : result
      };
      db.collection("category").find({},{projection:{'Name':1}}).toArray((err, result) => {
        if (err) throw err;
        data.categoryNamelist = result;
        res.render('device',{data:data});
      });
    })
  }
});

router.post('/add', function(req, res, next) {
  let data = req.body;
  let timeCreate = new Date();
  data.timeCreate = timeCreate.toLocaleDateString();
  db = res.app.locals.db;
  db.collection("device").insertOne(data, (err, result) => {
    if(err) throw err;
    data._id=result.insertedId;
    // console.log(result)
    res.send(data);
    res.end()
  })

});

router.post('/search', (req, res) => {
  var infor = new Object();
  if(req.body.DeviceID)
    infor.DeviceID= new RegExp(req.body.DeviceID);
  if(req.body.Status)
    infor.Status=new RegExp(req.body.Status);
  if(req.body.CalibrateFunction)
    infor.CalibrateFunction=new RegExp(req.body.CalibrateFunction);
  if(req.body.QualityFlag)
    infor.QualityFlag=new RegExp(req.body.QualityFlag);
  if(req.body.CalibrateDate)
    infor.CalibrateDate=new RegExp(req.body.CalibrateDate);
  db.collection("device").find(infor).limit(10).toArray(function (err, data) {
    if (err) throw err;
    console.log(data)
    res.send(JSON.stringify(data));
    res.end();
  });
});

router.post("/delete", (req, res, next) => {
  let id = req.body._id;
  console.log(id);
  db = res.app.locals.db;
  db.collection("device").deleteOne({_id: ObjectID(id)},(err, result) => {
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
  console.log(newData);
  db.collection("device").updateOne({_id: ObjectID(id)},{$set:newData},{upsert:true},(err, result) => {
    if (err) throw err;
    res.end();
  });
})


// router.post("/getCategoryID", (req, res, next) => {
//   db = res.app.locals.db;
//   db.collection("category").find({},{projection:{'CategoryID':1}}).toArray((err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// })


module.exports = router;
