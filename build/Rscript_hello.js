"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Rscript
const child_process_1 = require("child_process");
// Define the Rscript command and the path to your R script
const command = 'Rscript';
const scriptPath = 'C:\Users\fravi\Documents\Tirocinio\hello.R';
// Spawn the Rscript process
const child = (0, child_process_1.spawn)(command, [scriptPath]);
// Listen for data from the R process (stdout and stderr)
child.stdout.on('data', (data) => {
    console.log(`R Output: ${data}`);
});
child.stderr.on('data', (data) => {
    console.error(`R Error: ${data}`);
});
// Listen for the R process to exit
child.on('close', (code) => {
    console.log(`Rscript process exited with code ${code}`);
});
