const fs    = require('fs');
const path  = require('path');


//////////////////////////////////////////////
//  GLOBAL
//////////////////////////////////////////////


const private = path.join(__dirname, 'private');
const public  = path.join(__dirname, 'public');

//  LOADER

function loader(dir, file) {

    // Load module.
    let module = require(path.join(dir, file));

    // Export module.
    exports[module.name] = module;
}


//////////////////////////////////////////////
//  MODULE
//////////////////////////////////////////////


fs.readdirSync(private).forEach(loader.bind(null, private));
fs.readdirSync(public).forEach(loader.bind(null, public));
