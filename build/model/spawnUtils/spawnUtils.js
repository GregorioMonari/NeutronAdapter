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
exports.runModel = void 0;
const core_1 = require("./core");
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
function calculateCorrection(jungData, finappData) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseFileName = "dataIO/test_2";
        //TODO 1: scrivere jung data e finappData in baseFileName.in1.csv e baseFileName.in2.csv
        fs.writeFileSync("./src/model/" + baseFileName + ".in1.csv", jungData);
        fs.writeFileSync("./src/model/" + baseFileName + ".in2.csv", finappData);
        //TODO 2: spawn model
        console.log("---------<Starting R model>-----------");
        console.time("Model execution time");
        const consoleOutput = yield runModel(baseFileName);
        console.log(">> R MODEL OUTPUT");
        console.log(consoleOutput.out);
        console.timeEnd("Model execution time");
        console.log(">> Errors");
        console.log(consoleOutput.err);
        console.log("---------<R model END>-----------");
        //TODO 3: leggi output da baseFileName.out.csv
        const outStringData = fs.readFileSync("./src/model/" + baseFileName + ".out.csv");
        return outStringData.toString();
    });
}
exports.default = calculateCorrection;
function runModel(baseFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = "Rscript";
        const scriptPath = "processing_imola_v0001.R";
        const working_dir = "./src/model";
        const response = yield (0, core_1.spawnSync)(command, [scriptPath, baseFilePath], working_dir);
        return response;
    });
}
exports.runModel = runModel;
