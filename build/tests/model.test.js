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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neutronCount2SoilMoisture_1 = require("../model/spawnUtils/neutronCount2SoilMoisture");
const core_1 = require("../model/spawnUtils/core");
const NmdbClient_1 = __importDefault(require("../client/NmdbClient"));
const FinAppClient_1 = __importDefault(require("../client/FinAppClient"));
const neutronCount2SoilMoisture_2 = __importDefault(require("../model/spawnUtils/neutronCount2SoilMoisture"));
test("spawnHello", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, core_1.spawnHello)();
    console.log(response);
    expect(response).not.toBe("");
}));
test("spawnModel", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, neutronCount2SoilMoisture_1.runModel)("testData/test_2");
    console.log(response);
}), 60000);
test("feed data from api", () => __awaiter(void 0, void 0, void 0, function* () {
    const jclient = new NmdbClient_1.default();
    const fclient = new FinAppClient_1.default("../resources/id_sensor_baroni.csv");
    console.log("** FETCHING DATA FROM API");
    const jungData = yield jclient.getRawData("JUNG", "2023-06-10", "2023-10-12");
    console.log("Received", jungData.length, "Bytes from Jung");
    const finappData = yield fclient.getRawFinappData(67);
    console.log("Received", finappData.length, "Bytes from Finapp");
    const modelOutput = yield (0, neutronCount2SoilMoisture_2.default)(jungData, finappData); //TODO: leggi e scrivi su file
    console.log("Output:", modelOutput.length);
}), 60000);
/*
test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await spawnHello()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})
*/ 
