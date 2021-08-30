const fs = require('fs');
const path = require('path');


const clearFile = (filePath) =>{
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err)=>console.log(err));
};

exports.clearFile = clearFile;
