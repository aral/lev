var spawn = require('child_process').spawn;
var path = require('path');
var levelup = require('level');
var p = path.join(__dirname, '..', 'fixtures', 'db');
var lev = path.join(__dirname, '..', '..', 'lev');

var options = {};
var OK = '"OK"\r\n';

const test_key1 = 'testkey1';
const test_value1 = 'testvalue1';
const test_key2 = 'testkey2';
const test_value2 = 'testvalue2';
const test_key3 = 'testkey3';
const test_value3 = 'testvalue3';
const test_key4 = 'testkey4';
const test_value4 = 'testvalue4';
const test_key5 = 'testkey5';
const test_value5 = 'testvalue5';

//
// force some defaults in case user as a `.lev` file in their home directory.
//
var defaultargs = ['--format', 'false', '--encoding', 'utf8'];

module.exports = {

  'put to specific location (verbose argument)':
  function(test, next) {
    console.log("called tests in cli.js"); 
    test.plan(2);

    //
    // for the first test, create the database in case it does not exist.
    //
    var args = [p, '--put', test_key1, '--value', test_value1, '-c'].concat(defaultargs);
    console.log("spawning level " + lev);
    console.log("with args : " + args); 
    var test_cp1 = spawn(lev, args);
    var test_output1 = '';

    test_cp1.stderr.on('data', function (data) {
      test.fail(data);
    });

    test_cp1.stdout.on('data', function (data) {
      test_output1 += data;
    });

    test_cp1.on('exit', function (data) {
      console.log("child exit");      
      levelup(path.join(__dirname, '..', 'fixtures', 'db'), options, function (err, db) {
        
      test.equals( test_output1, OK);
        if (err) { return test.fail(err); }

        db.get(test_key1, function (err, value) {
          if (err) { return test.fail(err); }
          test.equals(test_value1, value, "Value stored and retrieved as expected");
          db.close();
          next();
        });
      });
    });
  },

   'put to specific location': 
   function(test, next) {

     test.plan(2);
  ///  var args = [p, '-p', test_key1, test_value1].concat(defaultargs);
     var args = [p, '--put', test_key2, '--value', test_value2, '-c'].concat(defaultargs);
   console.log("spawning level " + lev);
    console.log("with args : " + args); 
    
     var test_cp1 = spawn(lev, args);
     var test_output1 = '';

     test_cp1.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp1.stdout.on('data', function (data) {
       console.log(test_output1.toString())
       test_output1 += data;
     });

     test_cp1.on('exit', function (data) {
	
     //	test.ok(false, "path params fail", "#TODO params need debugging");
       test.equals(test_output1, OK);
       console.log("Got test value : " +  test_output1);
       levelup(p, options, function (err, db) {
      
         if (err) { return test.fail(err); }

         db.get(test_key2, function (err, value) {
          
           if (err) { return test.fail(err); }
           test.equals(test_value2, value);
           db.close();
           next();
         });
       });
     });
   },

   'put from within the current working dir': 
   function(test, next) {

     test.plan(2);

    // var args = [p, '--put', test_key3, test_value3].concat(defaultargs);
     var args = [p, '--put', test_key3, '--value', test_value3, '-c'].concat(defaultargs);
	
     var test_cp3 = spawn(lev, args, { cwd: p });
     var test_output3 = '';

     test_cp3.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp3.stdout.on('data', function (data) {
       test_output3 += data;
   });

     test_cp3.on('exit', function (data) {

       test.equals(test_output3, OK);

       levelup(p, options, function (err, db) {
        
         if (err) { return test.fail(err); }

         db.get(test_key3, function (err, value) {
          
           if (err) { return test.fail(err); }
           test.equals(test_value3, value);
           db.close();
           next();
         });
       });
     });
 },

   'put from within the current working dir (verbose argument)': 
   function(test, next) {

     test.plan(2);

    // var args = [p, '-p', test_key4, test_value4].concat(defaultargs);
     var args = [p, '--put', test_key4, '--value', test_value4, '-c'].concat(defaultargs);
	
     var test_cp4 = spawn(lev, args, { cwd: p });
     var test_output4 = '';

     test_cp4.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp4.stdout.on('data', function (data) {
       test_output4 += data;
     });
	  //    process.exit()

     test_cp4.on('exit', function (data) {

       test.equals(test_output4, OK);

       levelup(p, options, function (err, db) {
        
         if (err) { return test.fail(err); }

         db.get(test_key4, function (err, value) {
          
           if (err) { return test.fail(err); }
           test.equals(test_value4, value);
           db.close();
           next();
         });
       });
     });
   },

   'put binary data':
   function(test, next) {

     test.plan(2);

     var args = [
       p, '-p', test_key5, test_value5, '--keyEncoding=utf8',
       '--valueEncoding=binary'
     ];
	var args = [p, '--put', test_key5, '--value', test_value5, '-c', '--keyEncoding=utf8', '--valueEncoding=binary' ] //.concat(defaultargs);

     var test_cp5 = spawn(lev, args);
     var test_output5 = '';

     test_cp5.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp5.stdout.on('data', function (data) {
       test_output5 += data;
     });

     test_cp5.on('exit', function (data) {

       test.equals(test_output5, OK);

       levelup(p, { valueEncoding : 'binary' }, function (err, db) {

         if (err) { return test.fail(err); }

         db.get(test_key5, function (err, value) {

           if (err) { return test.fail(err); }
           test.equals(value.toString(), test_value5);
           db.close();
           next();
         });
       });
     });
   },

  'get from specific location': 
   function(test, next) {

     test.plan(1);

    // var args = [p, '-g', test_key1].concat(defaultargs);
     var args = [p, '--get', test_key1].concat(defaultargs);
     var test_cp1 = spawn(lev, args);
     var test_output1 = '';

     test_cp1.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp1.stdout.on('data', function (data) {
       test_output1 += data;
     });

     test_cp1.on('exit', function (data) {

       test.equals(test_output1,  '"' + test_value1  + '"\r\n');
     });
   },

   'get from specific location (verbose argument)': 
   function(test, next) {

     test.plan(1);

     var args = [p, '--get', test_key2].concat(defaultargs);

     var test_cp2 = spawn(lev, args);
     var test_output2 = '';

     test_cp2.stderr.on('data', function (data) {
       test.fail(data);
     });

     test_cp2.stdout.on('data', function (data) {
       test_output2 += data;
     });

     test_cp2.on('exit', function (data) {
  
	  //    process.exit()
       test.equals(test_output2,  '"' + test_value2 + '"\r\n' );
     });
   },

   'get binary data':
   function(test, next) {
    
     test.plan(1);

     var args = [p, '--valueEncoding=binary', '--keyEncoding=utf8', '--get', test_key5];

     var test_cp5 = spawn(lev, args);
     var test_output5 = '';

   test_cp5.stderr.on('data', function (data) {
       test.fail(data);
     });

     test_cp5.stdout.on('data', function (data) {
       test_output5 += data;
     });

     test_cp5.on('exit', function (data) {
       var arr = '[116,101,115,116,118,97,108,117,101,53]\r\n';
	   
       test.equals(test_output5,  arr);
     });
   },

   'delete a key': 
   function(test, next) {

     test.plan(2);

     var args = [p, '--del', test_key3].concat(defaultargs);

     var test_cp3 = spawn(lev, args, { cwd: p });
     var test_output3 = '';

     test_cp3.stderr.on('data', function (data) {
       test.fail(String(data));
     });

     test_cp3.stdout.on('data', function (data) {
       test_output3 += data;
     });

     test_cp3.on('exit', function (data) {

       test.equals(test_output3, OK);

       levelup(p, options, function (err, db) {
        
         if (err) { return test.fail(err); }

         db.get(test_key3, function (err, value) {
          
           if (err) { 
             test.ok(true); 
             db.close();
             next();
           }
           else {
             test.equals(test_value3, value);
           }

         });
       });
     });
   }
/*,
   'status':
   function(test, next){
        test.plan(1)
        test.ok(false, "only verbose options supported!")
	next()
   }	
*/

};
