var express = require('express');
var router = express.Router();
var conf = require('config');
const exec = require('child_process').exec;
var Wifi = require('rpi-wifi-connection');
var wifi = new Wifi();
var ip = require("ip");
var proc = require('rpi-proc-info');
var Datastore = require('nedb');
var db = new Datastore({
    filename: '/home/pi/db/remobooo/system.db'
});
db.loadDatabase();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{conf:conf,title:'リモブー',ip:ip,host:req.headers.host});
});

router.get('/info', function(req, res, next) {
  wifi.scan().then((ssids)=>{
    wifi.getStatus().then((status) => {
      res.render('info',{conf:conf,ssids:ssids,status:status,title:'リモブー',ip:ip,host:req.headers.host,proc:proc});
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .catch((error)=>{
  });
});

router.get('/reboot', function(req, res, next) {
  res.render('reboot',{conf:conf,title:'リモブー',ip:ip,host:req.headers.host});
});

router.get('/settings', function(req, res, next) {
  wifi.scan().then((ssids)=>{
    wifi.getStatus().then((status) => {
      res.render('settings',{conf:conf,ssids:ssids,status:status,title:'リモブー',ip:ip,host:req.headers.host,proc:proc});
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .catch((error)=>{
  });
});

router.get('/amazon', function(req, res, next) {
  res.render('amazon',{conf:conf,title:'リモブー',ip:ip,host:req.headers.host});
});
router.get('/errors', function(req, res, next) {
  res.render('errors',{conf:conf,title:'リモブー',ip:ip,host:req.headers.host});
});

router.post('/api/v1/wifi', function(req, res, next) {
  var ssid = req.body.ssid;
  var passwd = req.body.passwd;
  console.log(ssid);
  wifi.connect({ssid:ssid, psk:passwd}).then(() => {
    res.send('Connected to network.');
  })
  .catch((error) => {
      res.send(error);
  });
});

router.get('/api/v1/temperature', function(req, res, next) {
  res.json(
    {
      cpu:proc.temperature.cpu,
      gpu:proc.temperature.gpu
    }
  );
});

router.get('/api/v1/update',function(req,res,next){
  exec("git pull", (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      console.log(stderr);
    }
    res.json(
      {
        status:200,
        updated:true
      }
    );
  });
});

router.get('/api/v1/reboot',function(req,res,next){
  exec("pm2 restart remobooo-pi", (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      console.log(stderr);
    }
    console.log(stdout);
  });
  res.redirect('/');
});
module.exports = router;
