const index = require("./index.js");

test("getFilesRecursively should find 7 files", () => {
    index.getFilesRecursively("./files/").then(files => {
        console.log(files);
        expect(files.length).toBe(7);
    });
});

