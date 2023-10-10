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
const spawnUtils_1 = require("../model/spawnUtils/spawnUtils");
test("spawnHello", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, spawnUtils_1.spawnHello)();
    console.log(response);
    expect(response).not.toBe("");
}));
test("spawnModel", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, spawnUtils_1.executeRModel)();
    console.log(response);
}));
/*
test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await spawnHello()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})
*/ 
