var through = require('through2');
var path = require('path');
var fs = require('fs');
const shell = require('shelljs');

function shellSync(package) {
    return new Promise((resolve, reject) => {
        if (shell.exec(package.command, { silent: true }).code == 0) {
            shell.exec(package.command, { silent: true }, function(code, stdout, stderr) {
                console.log('Program output:', stdout);
                resolve();
            });
        } else {
            console.log('No typings found for: (%s)', package.name);
            resolve();
        }
    })
}

module.exports = function(label) {
    function log(file, enc, cb) {
        var filePath = path.join(file.path, label)
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                throw err;
            }

            // Run commands
            fs.stat('typings.json', function(err, stat) {
                if (err == null) {
                    console.log('Typings file already exists');
                    var keyCount = 0;
                    var bowerJson = JSON.parse(content).dependencies;
                    for (var i in bowerJson) {
                        let obj = {
                            name: i,
                            command: 'typings install dt~' + i + ' --global --save'
                        }
                        shellSync(obj)
                            .then((cmd) => {
                                keyCount++;
                                if (keyCount == Object.keys(bowerJson).length) {
                                    cb(null, file);
                                }
                            });
                    }
                } else {
                    let cmdInitTypings = {
                        name: "init",
                        command: 'typings init'
                    }
                    shellSync(cmdInitTypings).then(() => {

                        var keyCount = 0;
                        var bowerJson = JSON.parse(content).dependencies;
                        for (var i in bowerJson) {
                            let obj = {
                                name: i,
                                command: 'typings install dt~' + i + ' --global --save'
                            }
                            shellSync(obj)
                                .then((cmd) => {
                                    keyCount++;
                                    if (keyCount == Object.keys(bowerJson).length) {
                                        cb(null, file);
                                    }
                                });
                        }
                    });
                }
            });
        });
    }
    return through.obj(log);
};