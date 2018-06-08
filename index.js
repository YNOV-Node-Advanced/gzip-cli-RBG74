const util = require("util");
const zlib = require("zlib");
const gzip = zlib.createGzip();
const fs = require("fs");

const inputFolder = "./files/";
const outputFolder = "./zips/";

//Zips all files in inputDir and subdirs to the outputDir
const zipFiles = async function(inputDir, outputDir) {
    return new Promise(async(resolve, reject) => {
        try {
            const files = await getFilesRecursively(inputDir);
            const promises = [];
            files.forEach(file => {
                const filepath = file.split("/");
                const filename = filepath[filepath.length - 1];
                const input = file;
                const output = outputDir + filename;
                promises.push(zipFile(input, output));
            });
            Promise.all(promises).then(()=>{
                resolve();
            });
        } catch (error) {
            console.error("Error caught while ziping files:", error);
            reject (error);
        }
    });
    
};
exports.zipFiles = zipFiles;

//Zips a single file
const zipFile = function(input, output) {
    return new Promise((resolve, reject) => {
        const inp = fs.createReadStream(input);
        const out = fs.createWriteStream(output + ".gz");
        inp.pipe(gzip)
            .pipe(out)
            .on("error", function(err) {
                console.log("wtf error", err);
                reject(err);
            })
            .on("finish", () => {
                //console.log(input + " compressed as " + output + ".gz");
                resolve();
            });
    });
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