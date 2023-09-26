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
const axios_1 = __importDefault(require("axios"));
const CsvParser_1 = require("../utils/CsvParser");
class FinAppClient {
    constructor(_excelPath) {
        this.excelPath = _excelPath;
    }
    getFinappData(excelRowNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            //1. READ EXCEL
            //const filePath='C:/Users/fravi/Documents/GitHub/NeutronAdapter/resources/id_sensor_baroni.csv';
            const excel = yield (0, CsvParser_1.read_csv_from_path)(this.excelPath, ",");
            //2. Extract sensor id
            const id_finapp = excel["id_finapp"][excelRowNumber];
            //3. Get data from api with id_finapp as parameter
            const rawData = yield this.getRawFinappData(id_finapp);
            //4. Parse string to json
            const csvData = yield (0, CsvParser_1.read_csv_from_string)(rawData, ";");
            return csvData;
        });
    }
    getRawFinappData(id_finapp) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Values before get request:",idFinappValues)
            //const id_finapp= idFinappValues[1];
            const id_finapp_detector = 1;
            const finappUrl = "https://www.finapptech.com/finapp/api/getCSV_id.php?ID=" + id_finapp + "=&D=" + id_finapp_detector;
            //console.log(finappUrl)
            const response = yield axios_1.default.get(finappUrl);
            const data = response.data;
            return data;
        });
    }
}
exports.default = FinAppClient;
