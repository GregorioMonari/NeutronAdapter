"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.spawnSync = exports.spawnHello = exports.executeRModel = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
/*
FLOW
Flusso di runRModel
1. chiamo api jung e finapp, in uscita voglio i dati RAW (no json)
2. chiamo runRModel con come argomento i dati RAW
3. in uscita prendo la stringa csv

COSA SUCCEDE DENTRO RUNRMODEL
1. Prendo gli argomenti jungData e finappData e li scrivo nei file test.in1.csv e in2
2. chiamo executeModel, che legge da quei file e scrive nel file out
3. Leggo il file out e ritorno la stringa csv

*/
//TODO: CAMBIA SOLO QUESTA FUNZIONE
function runRModel(jungData, finappData) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseFileName = "test";
        //TODO 1: scrivere jung data e finappData in baseFileName.in1.csv e baseFileName.in2.csv
        //TODO 2: spawn model
        yield executeRModel();
        //TODO 3: leggi output da baseFileName.out.csv
        const outStringData = fs.readFileSync("./src/model/dataIO/test.out.csv");
        return outStringData.toString();
    });
}
exports.default = runRModel;
function executeRModel() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = "Rscript";
        const scriptPath = "processing_imola_v0001.R";
        const working_dir = "./src/model";
        const response = yield spawnSync(command, [scriptPath], working_dir);
        return response;
    });
}
exports.executeRModel = executeRModel;
//TEST
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
function spawnSync(command, args, working_dir) {
    let out = "";
    return new Promise((resolve, reject) => {
        //const command="Rscript";
        //const scriptPath="./src/examples/hello.R";
        const child = (0, child_process_1.spawn)(command, args, { cwd: working_dir });
        child.stdout.on('data', (data) => {
            //console.log(`R Output: ${data}`);
            out = out + data;
        });
        child.stderr.on('data', (data) => {
            console.error(`R Error: ${data}`);
            //reject(data);
        });
        child.on("exit", () => {
            resolve(out);
        });
    });
}
exports.spawnSync = spawnSync;
