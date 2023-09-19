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
/*
const stringa1="ciao";
var stringa2="Lorem ipsum dixit";
console.log("Stringa: "+stringa1+", lunghezza: "+stringa1.length+", primo carattere: "+stringa1[0])

const arr= stringa2.split(" ");
console.log(stringa2)
console.log(arr)

stringa2 = stringa2.toLowerCase()
const value= stringa2.startsWith("l")
console.log(value)
*/
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("starting program");
        //DEFINE DATES
        const data = yield getJungDataOfToday();
        console.log(data);
        console.log("Received " + (data.length / 1000) + " Kilobytes");
        console.log("finished program");
    });
}
function getJungDataOfToday() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const stringDate = now.toISOString();
        const arr = stringDate.split("T");
        const stopDate = arr[0];
        const data = yield getJungData(stopDate, stopDate);
        return data;
    });
}
function getJungData(startDate, stopDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const station = "JUNG";
        const data = yield getRawApiData(station, startDate, stopDate);
        return data;
    });
}
//RITORNA I DATI IN UN INTERVALLO TEMPORALE GENERICO DI UNA STAZIONE GENERICA
function getRawApiData(station, startDate, stopDate) {
    return __awaiter(this, void 0, void 0, function* () {
        //PARSE DATES
        const startDateArr = startDate.split("-");
        //console.log(startDateArr)
        const stopDateArr = stopDate.split("-");
        //console.log(stopDateArr)
        const T_ini_d = startDateArr[2];
        const T_ini_m = startDateArr[1];
        const T_ini_y = startDateArr[0];
        const T_end_d = stopDateArr[2];
        const T_end_m = stopDateArr[1];
        const T_end_y = stopDateArr[0];
        //MAKE REQUEST
        const url = "http://nest.nmdb.eu/draw_graph.php?formchk=1&stations[]=" + station + "&tabchoice=revori&dtype=corr_for_efficiency&tresolution=60&yunits=0&date_choice=bydate&start_day=" + T_ini_d + "&start_month=" + T_ini_m + "&start_year=" + T_ini_y + "&start_hour=0&start_min=0&end_day=" + T_end_d + "&end_month=" + T_end_m + "&end_year=" + T_end_y + "&end_hour=23&end_min=59&output=ascii";
        const response = yield axios_1.default.get(url);
        //CHECK DATA INTEGRITY
        const data = response.data;
        if (data.includes("Sorry, no data available"))
            throw new Error("Sorry, no data available");
        return data;
    });
}
/*
axios.get(url)
    .then((response)=>{
        console.log(response.data)
    })
    .catch((e)=>{
        console.log("E' ARRIVATO UN ERRORE! PROBABILMENTE HAI SBAGLIATO L'URL")
    })
    .finally(()=>{
        console.log("Ho concluso la richiesta. Potrebbe essere andata bene o male.")
    })


console.log("CIAO")
*/
