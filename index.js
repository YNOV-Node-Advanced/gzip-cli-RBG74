const util = require("util");
const zlib = require("zlib");
const gzip = zlib.createGzip();
const fs = require("fs");

const inputFolder = "./files/";
const outputFolder = "./zips/";

const zipFiles = async function(inputDir, outputDir) {
    try {
        const files = await getFilesRecursively(inputDir);
        files.forEach(file => {
            const filepath = file.split("/");
            const filename = filepath[filepath.length - 1];
            const input = file;
            const output = outputDir + filename;
            zipFile(input, output);
        });
    } catch (error) {
        console.error("Error caught while ziping files:", error);
    }
};
exports.zipFiles = zipFiles;

const zipFile = function(input, output) {
    const inp = fs.createReadStream(input);
    const out = fs.createWriteStream(output + ".gz");
    console.log(input + " compressed as " + output + ".gz");
    inp.pipe(gzip).pipe(out);
};
exports.zipFile = zipFile;

const readdir = util.promisify(fs.readdir);
const getFilesRecursively = async function(dir) {
    return new Promise((resolve, reject) => {
        let results = [];

        readdir(dir)
            .then(items => {
                let promises = [];
                items.forEach(item => {
                    const stat = fs.statSync(dir + item);
                    if (stat && stat.isDirectory()) {
                        promises.push(getFilesRecursively(dir + item + "/"));
                    } else {
                        results.push(dir + item);
                    }
                });
                Promise.all(promises)
                    .then(res => {
                        res.forEach(files => {
                            results = results.concat(files);
                        });
                        resolve(results);
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
};
exports.getFilesRecursively = getFilesRecursively;

//zipFiles(inputFolder, outputFolder);
/*getFilesRecursively(inputFolder).then(files =>
    console.log("End result:", files)
);*/
