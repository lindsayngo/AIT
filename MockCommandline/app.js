// app.js
// ======
// bring in dependencies like path, fs, etc.
// express setup goes here

// bring in vfs/FileSystem.js b
// let declare a global variable containing the instance of the class
// contained in FileSystem.js


// read init.json with path.join(__dirname, 'vfs', 'init.json')
// in callback:
// 1. parse json with JSON.parse
// 2. instantiate FileSystem object with object created from parsing init.json
// 3. listen on port 3000

const fs = require('fs');
fs.readFile('./vfs/init.json', 'utf8', function(err, data) {

    if (err) {
      console.log('uh oh', err);
    }
    
    else {//we only want to start the server AFTER reading init.json
    
    //use Moment for when adding new files and directories
    
    
    //dataObj is a NESTED object... "fs: { '/' : { ... {...} } } "  
    const dataObj = JSON.parse(data);
    //console.log(dataObj['fs']['/']['files']);

    const FileSystemClass = require('./vfs/FileSystem.js');
    const f = new FileSystemClass(dataObj);

    //f.find('/lib/modules/aba.txt')
    //f.find('/lib/modules')
    //f.traverseAndList('')
    //f.traverseAndList('/lib/modules')
    //f.cat('/lib/modules/aba.txt');
    //f.makeDirectory('/lib/modules', 'tmp');
    //f.write('/lib/modules/erf', 'wassup')


    const express = require('express');
    const path = require('path');

    const app = express();

    app.set('view engine', 'hbs');

    const publicPath = path.join(__dirname, 'public');
    app.use(express.static(publicPath));

    const logger = (req, res, next) => {
      console.log(req.method, req.path, req.query);
      next();
    };
    app.use(logger);

    app.use((req, res, next) => {
      if(req.get('Host')) {
        next();
      } else {
        res.status(400).send('invalid request');
      }
    });

    app.use(express.urlencoded({extended: false}));

    app.get('/', function(req,res){
        res.render('index');
    });

    //data 1
    app.get('/vfs', function(req,res){
        console.log(req.query.osview);
        console.log('command: ', req.query.command);
        console.log('path: ', req.query.path);
        console.log('option: ', req.query.option);

        if(req.query.command === 'ls' && req.query.option === '-l'){

          if(f.traverseAndList(req.query.path, 'yes').length === 0){ 
            res.render('terminal', { 
              'divtype': req.query.osview,
              'response': 'ls: No such file or directory'
            });
          }

          else{ 
            let str = f.traverseAndList(req.query.path, 'yes').toString();
            str = '<p>' + str.replace(/,/g,'\n');
            str = str.replace(/\n/g, '</p> <p>') + '</p>';
            console.log(str);
            res.render('terminal', { 
              'divtype': req.query.osview,
              'response': str
            });
          }

        }
        else if(req.query.command === 'ls' ){

          if(f.traverseAndList(req.query.path, 'yes').length === 0){ 
            res.render('terminal', { 
              'divtype': req.query.osview,
              'response': 'ls: No such file or directory'
            });
          }

          else{ 
            let str = f.traverseAndList(req.query.path, 'no').toString();
            str = '<p>' + str.replace(/,/g,'\n');
            str = str.replace(/\n/g, '</p> <p>') + '</p>';
            console.log(str);
            res.render('terminal', { 
              'divtype': req.query.osview,
              'response': str
            });
          }

        }
        else if(req.query.command === 'cat'){
          if(f.cat(req.query.path) !== null){
            const result = f.cat(req.query.path);
            
            res.render('terminal', {
              'divtype': req.query.osview,
              'response': result
            });
          }
          else{
            res.render('terminal', {
              'divtype': req.query.osview,
              'response': 'cat: No such file or directory'
            });
          }
        }
        else if(req.query.command === 'tree'){
          const result = f.find(req.query.path);
          console.log(result);
          if(result !== null) {
            const str = "";
            const arr = [];
            //fill array arr with string representations of tree file system
            f.recurse(result, str, 0, arr);
            console.log(arr);
            console.log(arr[arr.length-1].toString());
  
            res.render('terminal', {
              'divtype': req.query.osview,
              'response': arr[arr.length-1]
            });
          }
        else{
            res.render('terminal', {
              'divtype': req.query.osview,
              'response': 'tree: No such file or directory'
            });
        }
      }

      else{
        res.render('terminal', {
          'divtype': req.query.osview
        });
      } 

    });

    //data 2
    app.post('/vfs', function(req,res){
        console.log(req.body.osview);
        console.log('command: ', req.body.command);
        console.log('path: ', req.body.path);
        console.log('content: ', req.body.content);

        if(req.body.command === 'ls'){
          if(f.traverseAndList(req.body.path, 'no').length === 0){ 
            res.render('terminal', { 
              'divtype': req.body.osview,
              'response': 'ls: No such file or directory'
            });
          }
          else{
            let str = f.traverseAndList(req.body.path, 'no').toString();
            str = '<p>' + str.replace(/,/g,'\n');
            str = str.replace(/\n/g, '</p> <p>') + '</p>';
            console.log(str);
            res.render('terminal', { 
              'divtype': req.body.osview,
              'response': str
            });
          }
        }

        else if(req.body.command === 'mkdir'){
          const result = f.makeDirectory(req.body.path, req.body.content);
          if(result !== null){
            console.log(result);
            let str = "";
            for(const prop in result['files']){
              str = str + prop + "<br>";
            }
            res.render('terminal', {
              'divtype': req.body.osview,
              'response': str
            });
          }
          else{
            res.render('terminal', {
              'divtype': req.body.osview,
              'response': 'mkdir: No such file or directory' 
            });
          }
        }

        else if(req.body.command === 'write'){

          //the file doesn't already exist
          if(f.find(req.body.path) === null){
            console.log('file does not already exist; writing a new one');
            f.write(req.body.path, req.body.content);
            //the file does not exist and must be written 
            res.render('terminal', {
              'divtype': req.body.osview,
              //no response: write was successful
            });
          }

          //the file is not actually a file OR it already exists
          else if(f.find(req.body.path)['permission'] === 'drwxr--r--'){
            res.render('terminal', {
              'divtype': req.body.osview,
              'response': 'write: No such file or directory'
            });
          }

            //the file is not a file and is instead a directory
            
            //the file already exists
            else{
              console.log('file already exists; writing over it');
              f.write(req.body.path, req.body.content);
              res.render('terminal', {
                'divtype': req.body.osview
                //no response: write was successful
              });
            }

          
        }//end of else if req.body.command === write

        // else{
        //   res.render('terminal', {
        //     'divtype': req.body.osview
           //}
          
          
    });

    app.listen(3000);

    }
});
