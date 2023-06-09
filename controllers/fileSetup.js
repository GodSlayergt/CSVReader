const multer = require('multer');  
const path = require('path');      
const csv = require('csv-parser');  
const fs = require('fs');
const uploadedFileNames = [];      

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../','/uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
  });


function fileFilter (req, file, cb) {

    if(file.mimetype == 'text/csv'){
        cb(null,true);
    }
    else{
        console.log("File is not csv type");
        cb(null,false);
    }
  }

const upload = multer({storage:storage,fileFilter:fileFilter}).single('uploaded_file');  //initializing multer


module.exports.upload = function(req,res){
    upload(req,res,function(err){
        if(err instanceof multer.MulterError){
            console.log("****Multer error",err);
            return;
        }
        else if(err){
            console.log('multer error',err);
            return;
        }
        else if(req.file){
            uploadedFileNames.push(req.file.filename);
        }
        return res.redirect('back');
    });
}


module.exports.uploadedFileNames = function(){
  return uploadedFileNames;
}


module.exports.open = function(req,res){
  const csvParsedData = [];              
  const index = req.query.index;
  fs.createReadStream(path.join(__dirname,'../','/uploads',uploadedFileNames[index])) 
  .pipe(csv())
  .on('data', (data) => csvParsedData.push(data))
  .on('end', () => {
    console.log(csvParsedData)
    return res.render('renderCSV.ejs',{
  
      csvData: csvParsedData
    });
  });
}


module.exports.delete = function(req,res){
  let index = req.query.index;
  try { var files = fs.readdirSync(path.join(__dirname,'..','/uploads')); }
    catch(e) { return; }
    if (files.length > 0){
        var filePath = path.join(__dirname,'..','/uploads',uploadedFileNames[index]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
    }
    uploadedFileNames.splice(index,1);
    return res.redirect('back');
}