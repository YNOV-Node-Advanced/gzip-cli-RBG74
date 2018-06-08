const fs = require("fs");
const index = require("./index.js");

it("getFilesRecursively should find 7 files", () => {
    index.getFilesRecursively("./files/").then(files => {
        expect(files.length).toBe(7);
    });
});

it("zipFile should create ./zips/test1/files1.txt.gz", () => {
    index.zipFile("./files/file1.txt", "./zips/test1/file1.txt").then(() => {
        index.getFilesRecursively("./zips/test1/").then(files => {
            expect(files[0]).toBe("./zips/test1/file1.txt.gz");
            removeFile("./zips/test1/file1.txt.gz")
        });
    });
});

it("zipFiles should create 7 files", () => {
    index.zipFiles("./files/", "./zips/test2/").then(() => {
        index.getFilesRecursively("./zips/test2/").then(files => {
            expect(files.length).toBe(7);
            files.forEach(file => {
                removeFile(file);
            });
            
        });
    });
});

function removeFile(filepath) {
    fs.unlink(filepath, err => {
        if (err) throw err;
    });
}
