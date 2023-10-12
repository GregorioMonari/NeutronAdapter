"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnHello = exports.spawnSync = void 0;
const child_process_1 = require("child_process");
function spawnSync(command, args, working_dir) {
    let out = "";
    let errOut = "";
    return new Promise((resolve, reject) => {
        //const command="Rscript";
        //const scriptPath="./src/examples/hello.R";
        const child = (0, child_process_1.spawn)(command, args, { cwd: working_dir });
        child.stdout.on('data', (data) => {
            //console.log(`R Output: ${data}`);
            out = out + data;
        });
        child.stderr.on('data', (data) => {
            //console.error(`R Error: ${data}`);
            //reject(data);
            errOut = errOut + data;
        });
        child.on("exit", () => {
            resolve({ "out": out, "err": errOut });
        });
    });
}
exports.spawnSync = spawnSync;
//--------TEST---------
function spawnHello() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = "Rscript";
        const scriptPath = "hello.R";
        const working_dir = "./src/model";
        const response = yield spawnSync(command, [scriptPath, "test_1"], working_dir);
        return response;
    });
}
exports.spawnHello = spawnHello;
