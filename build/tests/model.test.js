"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
test("Spawn generic R script", () => {
    const command = "Rscript";
    const scriptPath = "./src/examples/hello.R";
    const child = (0, child_process_1.spawn)(command, [scriptPath]);
    child.stdout.on('data', (data) => {
        console.log(`R Output: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.error(`R Error: ${data}`);
    });
    child.on("exit", () => {
    });
});
