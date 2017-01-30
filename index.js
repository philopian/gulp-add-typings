var through = require('through2');
var path = require('path');
var fs = require('fs');
const shell = require('shelljs');

function shellAsync(command) {
    return new Promise((resolve, reject) => {
        resolve(shell.exec(command));
    })
}

module.exports = function(label) {
    function log(file, enc, cb) {
        var filePath = path.join(file.path, label)
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                throw err;
            }

            // Get a list of the the bower dependencies
            var bowerJson = JSON.parse(content);
            let depBower = "";
            for (var i in bowerJson.dependencies) {
                depBower += "dt~" + i + " ";
            }

            // Commands
            let commandInitTypings = 'typings init --name appseed';
            let commandAddBowerTypings = 'typings install ' + depBower + ' --global --save';

            // Run commands
            fs.stat('typings.json', function(err, stat) {
                if (err == null) {
                    console.log('Typings file already exists');
                    shellAsync(commandAddBowerTypings).then(() => {
                        return;
                    });
                } else {
                    shellAsync(commandInitTypings).then(() => {
                        return shellAsync(commandAddBowerTypings);
                    });
                }
            });

            cb(null, file);
        });
    }

    return through.obj(log);
};