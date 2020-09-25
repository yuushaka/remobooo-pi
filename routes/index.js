var express = require('express');
var router = express.Router();
var conf = require('config');
const exec = require('child_process').exec;
var ip = require("ip");
var proc = require('rpi-proc-info');
var git = require( 'simple-git' );
var Datastore = require('nedb');
var db = new Datastore({
    filename: '/home/pi/db/remobooo/system.db'
});
db.loadDatabase();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{conf:conf,title:'RemoboooPi',ip:ip,host:req.headers.host});
});

router.get('/info', function(req, res, next) {
  res.render('info',{conf:conf,status:status,title:'RemoboooPi',ip:ip,host:req.headers.host,proc:proc});
});

router.get('/updated', function(req, res, next) {
  res.render('updated',{conf:conf,title:'RemoboooPi',ip:ip,host:req.headers.host});
});

router.get('/reboot', function(req, res, next) {
  res.render('reboot',{conf:conf,title:'RemoboooPi',ip:ip,host:req.headers.host});
});

router.get('/amazon', function(req, res, next) {
  res.render('amazon',{conf:conf,title:'RemoboooPi',ip:ip,host:req.headers.host});
});

router.get('/errors', function(req, res, next) {
  res.render('errors',{conf:conf,title:'RemoboooPi',ip:ip,host:req.headers.host});
});

router.get('/api/v1/temperature', function(req, res, next) {
  res.json(
    {
      cpu:proc.temperature.cpu,
      gpu:proc.temperature.gpu
    }
  );
});

router.get('/update',function(req,res,next){
  var git_url = 'https://github.com/yuushaka/remobooo-pi.git';
  var local_folder = '/home/pi/remobooo-pi';
  git( local_folder ).pull();
  res.redirect('/updated');
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
