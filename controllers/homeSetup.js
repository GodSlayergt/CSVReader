const fileSetup = require('./fileSetup');

const uploadedFileNames = fileSetup.uploadedFileNames;
const array = uploadedFileNames();  

module.exports.home = function(req,res){
    return res.render('home',{
        files: array
    });
}
