const express = require('express');
const router = express.Router();

const homeSetup = require('../controllers/homeSetup');
const fileSetup = require('../controllers/fileSetup');

router.get('/',homeSetup.home);    
router.post('/upload',fileSetup.upload);   
router.get('/open',fileSetup.open);        
router.get('/delete',fileSetup.delete); 
module.exports = router;