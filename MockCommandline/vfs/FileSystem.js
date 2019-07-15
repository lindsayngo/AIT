// FileSystem.js
// =============
const moment = require('moment');

class FileSystem {
  // initialize with object that represents virtual file system
  // the remainder of the design of this class is up to you!
    constructor(object){
        this.object = object;
        //object is NOT a JSON string, but an object that is a result of JSON parse
    }  

    recurse(objstart, str, count, arr){
        this.arr = arr;
        this.str = str;
        if(objstart.hasOwnProperty('files')){
          //console.log(objstart['files'])
          for(const prop in objstart['files']){
               let space = "";
               for(let i = 0; i < count; i++){
                    space += "&nbsp&nbsp";
               }
              this.str = this.str + "<br>" + space + prop + "\n";
              this.arr.push(this.str);
              //console.log(this.str)
              
              this.recurse(objstart['files'][prop], this.str, count+1, this.arr);
              count = 0;
          }
        }

        else{
            return;
        }

        //if the whole original path is completely finished being looked through

        //if the currently being explored path is still being looked through

        //if the currently being explored path is finished,
        //but there is still more in the whole original path is not yet finished 


    }

    find(pathToFile){
        //traverse file system nodes to find the file or directory
        //return an object of metadata of current file
        const arrpath = pathToFile.split('/');
        //console.log(arrpath)
        let root = this.object['fs']['/'];
        //console.log(root)
        // console.log(root['files']['home']['files']);
        //console.log('\n');
        let finalobj;
        let stop = false;
        //count keeps track of how mant dirs/files found
        //by the end, count should = the length of the path array
        let count = 1;
        while(stop === false){
            //console.log('at count = ', count)
            if(root['files'].hasOwnProperty(arrpath[count])){
                //console.log('FOUND: ', root['files'][arrpath[count]], '\n');
                root = root['files'][arrpath[count]];
                count += 1;
                //if the pathToFile is now complete, stop trying to traverse more
                if(count === arrpath.length){
                    finalobj = root;
                    stop = true;
                    break;
                }
            }
            else{
                stop = true;
                finalobj = root;
                break;
            }
        }
        // console.log('finalobj: ', finalobj);
        // console.log('count: ', count);
        // console.log('num in path: ', arrpath.length);
        if(count !== arrpath.length){
            //console.log('No such file or directory exists.')
            return null;
        }
        else{
            return finalobj;
        }
        
    }

    traverseAndList(pathToFile, specify){
        //for ls option
        //it path points to a directory, return list of JSON object representation of directory files
        //else, return empty list
        const result = this.find(pathToFile);
        const metaArr = [];
        let count = 0;
        if(result !== null){
            if(result['permission'] === 'drwxr--r--'){
                //console.log(this.find(pathToFile));
                for(const prop in result['files']){
                    console.log('wefe:', prop);
                    let metadata = '';
                    if(specify === 'no'){
                        metadata = prop;
                    }
                    else{
                        metadata = result['files'][prop]['permission'] + ' ' + result['files'][prop]['owner-name'] + ' ' + result['files'][prop]['owner-group'] + ' ' + result['files'][prop]['last-modified'] + ' ' + prop; 
                    }
                    console.log(metadata);
                    metaArr[count] = metadata;
                    count += 1;
                }

                return metaArr;
            }
            else{
                //console.log('Path points to a file, not a directory.');
                return [];
            }   
        }
        else{
            //console.log('No such directory exists.');
            return [];
        }
    }

    makeDirectory(pathToFile, dirName){
        //  1. call find(pathToFile) --> get object associated with dirName
        //  2. create new entry for this directory
        const now = moment();
        this.dirName = dirName;

        const arrpath = pathToFile.split('/');
        let root = this.object['fs']['/'];
        let finalobj;
        let stop = false;
        let count = 1;
        while(stop === false){
            if(root['files'].hasOwnProperty(arrpath[count])){
                root = root['files'][arrpath[count]];
                count += 1;
                //if the pathToFile is now complete, add the new directory
                if(count === arrpath.length){
                    finalobj = root;
                    if(finalobj.hasOwnProperty(this.dirName)){
                        console.log('Directory exists already...');
                    }
                    else{
                        finalobj['files'][dirName]= { 
                            "permission": "drwxr--r--",
                            "hard-links": 1,
                            "owner-name": "root",
                            "owner-group": "root",
                            "last-modified": now.format("MMM DD HH:mm"),
                            "size": 6,
                            "files": {
                            }
                        };
                    }
                    stop = true;
                    break;
                }
            }
            else{
                stop = true;
                finalobj = root;
                break;
            }
        }
        if(count !== arrpath.length){
            console.log('No such file or directory exists.');
            return null;
        }
        else{
             //console.log('final obj:' , finalobj);
             //console.log('object: ', this.object['fs']['/']['files']['lib']['files']['modules']);
            return finalobj;
        }
    }

    cat(pathToFile){
        //return file content, else return error message
        const result = this.find(pathToFile);
        if(result !== null){
            if(result['permission'] === '-rwxr--r--'){
                //console.log(result['content'])
                return result['content'];
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }

    write(pathToFile, content){
        //use find(pathToFile) to get the object of the directory
        //if file exists, overwrite with content
        //else, create new entry with propName as given file name and Content as content
        const now = moment();
        const arrpath = pathToFile.split('/');
        let root = this.object['fs']['/'];
        let finalobj;
        let stop = false;
        let count = 1;
        while(stop === false){
            if(root['files'].hasOwnProperty(arrpath[count])){
                root = root['files'][arrpath[count]];
                count += 1;
                //if the pathToFile is now complete, add the new file
                if(count === arrpath.length){
                    console.log('pathToFile now complete; overwrite file');
                    finalobj = root;
                    finalobj['content'] = content;
                    finalobj['last-modified'] = now.format("MMM DD HH:mm");
                    stop = true;
                    break;
                }
            }
            else{
                console.log('pathToFile was never complete, meaning path does not exist');
                stop = true;
                finalobj = root;
                break;
            }
        }
        if(count !== arrpath.length){
            console.log('add the new file');
            //console.log('No such file or directory exists.')
            //if the file does not already exist
            finalobj['files'][arrpath[arrpath.length-1]] = {
                "permission": "-rwxr--r--",
                "hard-links": 1,
                "owner-name": "root",
                "owner-group": "root",
                "last-modified": now.format("MMM DD HH:mm"),
                "user": "staff",
                "size": 6,
                "content": content              
            };
            console.log(finalobj);
            //console.log('final obj:' , finalobj);
            //console.log('object: ', this.object['fs']['/']['files']['lib']['files']['modules']);
            return finalobj;
        }
        else{
            
             //console.log('final obj:' , finalobj);
             //console.log('object: ', this.object['fs']['/']['files']['lib']['files']['modules']);
            return finalobj;
        }
    }

}

module.exports = FileSystem;

