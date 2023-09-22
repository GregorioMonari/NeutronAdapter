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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read_csv_from_string = exports.read_csv_from_path = void 0;
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
function read_csv_from_path(filePath, separator) {
    return __awaiter(this, void 0, void 0, function* () {
        //const filePath = 'C:/Users/fravi/Documents/GitHub/NeutronAdapter/id_sensor_baroni.csv'; 
        //const idFinappValues: string[] = [];
        return new Promise((resolve, reject) => {
            var container = null;
            var isFirstRow = true;
            fs.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)({
                separator: separator
            }))
                .on('data', (row) => {
                //console.log(row)
                if (isFirstRow) {
                    isFirstRow = false;
                    //console.log("Prima riga:",row)
                    container = row;
                    Object.keys(row).forEach((colName) => {
                        //console.log(colName)
                        const firstValue = row[colName];
                        container[colName] = [firstValue];
                    });
                }
                else {
                    //console.log("Altra riga:",row)
                    Object.keys(row).forEach((colName) => {
                        //console.log(colName)
                        const value = row[colName];
                        container[colName].push(value);
                    });
                }
                //const idFinappValue = row['id_finapp'];
                //if (idFinappValue) {
                //  idFinappValues.push(idFinappValue);
                //}
            })
                .on('end', () => {
                //console.log("FINISHED READING CSV")
                //console.log('id_finapp values:', idFinappValues);
                //console.log(container)
                resolve(container);
            })
                .on('error', (error) => {
                console.error('Error reading the CSV file:', error);
                reject(error);
            });
        });
    });
}
exports.read_csv_from_path = read_csv_from_path;
function read_csv_from_string(csvString, separator) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let container = null;
            let isFirstRow = true;
            var parser = (0, csv_parser_1.default)({
                separator: separator
            });
            parser
                .on('data', (row) => {
                //console.log(row)
                if (isFirstRow) {
                    isFirstRow = false;
                    //console.log("Prima riga:",row)
                    container = row;
                    Object.keys(row).forEach((colName) => {
                        //console.log(colName)
                        const firstValue = row[colName];
                        container[colName] = [firstValue];
                    });
                }
                else {
                    //console.log("Altra riga:",row)
                    Object.keys(row).forEach((colName) => {
                        //console.log(colName)
                        const value = row[colName];
                        container[colName].push(value);
                    });
                }
                //const idFinappValue = row['id_finapp'];
                //if (idFinappValue) {
                //  idFinappValues.push(idFinappValue);
                //}
            })
                .on('end', () => {
                //console.log("FINISHED READING CSV")
                //console.log('id_finapp values:', idFinappValues);
                //console.log(container)
                resolve(container);
            })
                .on('error', (error) => {
                console.error('Error reading the CSV file:', error);
                reject(error);
            });
            parser.write(csvString);
            parser.end();
        });
    });
}
exports.read_csv_from_string = read_csv_from_string;
