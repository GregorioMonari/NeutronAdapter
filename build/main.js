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
const FinAppClient_1 = __importDefault(require("./client/FinAppClient"));
const NmdbClient_1 = __importDefault(require("./client/NmdbClient"));
/*
main();

async function main() {

    const client= new NmDbClient();
    const data= await client.getJungDataOfToday()
    console.log(data)
}




*/
//ABBIAMO FATTO 3 COSE: FETCH DATA, PREPROCESS DATA (clean,parse), PROCESS DATA (model)
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("STARTING PROGRAM");
        const currentDatetime = new Date();
        // Calculate the midnight of yesterday
        const midnightYesterday = new Date(currentDatetime);
        midnightYesterday.setDate(currentDatetime.getDate() - 1);
        //midnightYesterday.setHours(0, 0, 0, 0);
        const yesterday = midnightYesterday.toISOString().split("T")[0];
        console.log(yesterday);
        // Calculate the midnight of today
        const midnightToday = new Date(currentDatetime);
        const today = midnightToday.toISOString().split("T")[0];
        console.log(today);
        //TODO[0]: trovami la data corrispondente alla mezzanotte di ieri e di oggi
        let startDate = yesterday; //mezzanotte di ieri
        let stopDate = today; //mezzanotte di stamattina
        //1. GET FINAPP DATA (json con colonne, non la stringa!!!)
        const excelPath = './resources/id_sensor_baroni.csv';
        const finappClient = new FinAppClient_1.default(excelPath);
        const finappData = yield finappClient.getFinappData(1);
        //console.log(finappData["#Datetime"],finappData.neutrons)
        // Convert #Datetime strings to Date objects
        const datetimeValues = finappData["#Datetime"].map((datetimeStr) => new Date(datetimeStr));
        // Get the current date in the local time zone
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        // Calculate the start of yesterday (00:00:00 UTC)
        const startOfYesterdayUTC = new Date(Date.UTC(currentYear, currentMonth, currentDay - 1, 0, 0, 0));
        // Calculate the end of yesterday (23:00:00 UTC)
        const endOfYesterdayUTC = new Date(Date.UTC(currentYear, currentMonth, currentDay - 1, 23, 0, 0));
        // Filter the values for yesterday
        const yesterdayTimeValues = datetimeValues.filter((datetime) => datetime >= startOfYesterdayUTC && datetime <= endOfYesterdayUTC);
        // Now you have the values for yesterday (from 00:00:00 to 23:00:00)
        console.log(yesterdayTimeValues);
        // Find the index range for yesterday's data
        const startIndex = datetimeValues.findIndex((datetime) => datetime >= startOfYesterdayUTC);
        const endIndex = datetimeValues.findIndex((datetime) => datetime >= endOfYesterdayUTC);
        // Extract neutrons values for yesterday
        const yesterdayFinappNeutrons = finappData.neutrons.slice(startIndex, endIndex + 1);
        // Now you have the neutrons values for yesterday in yesterdayNeutrons
        console.log(yesterdayFinappNeutrons);
        //TODO[1]: dammi la fetta di dati da mezzanotte di ieri a oggi
        let fetta1 = [];
        //2. GET JUNG DATA (json con colonne)
        const jungClient = new NmdbClient_1.default();
        //TODO[2]: instead of today's data, get previous day data starting from 00:00
        const jungData = yield jungClient.getJungData(yesterday, yesterday); //getJungDataOfToday();
        console.log(jungData);
        let fetta2 = [];
        //3. APPLY MODEL
        //TODO[3]: scrivi modello di correzione
        console.log("PROGRAM FINISHED");
    });
}
function applyCorrections(jungData, finappData) {
    console.log("Jung dates:", jungData.Datetime);
    const totDates = finappData["#Datetime"].length;
    console.log("Finapp dates:", finappData["#Datetime"][totDates - 1]);
    return 0;
}
/*
main()

async function main(){

    console.time("Csv read in")
    const filePath='C:/Users/fravi/Documents/GitHub/NeutronAdapter/id_sensor_baroni.csv';
    const csv= await read_csv_from_path(filePath,",")
    console.timeEnd("Csv read in")
    //console.log(csv["id_finapp"][0])
    console.log("starting program")
    
    const data= await getRawFinappData(csv["id_finapp"][1])
    //console.log(data)
    const csvData= await read_csv_from_string(data,";");
    console.log(csvData)
    //console.log("Received "+(data.length/1000)+" Kilobytes")
    console.log("finished program")
    
    
}

async function getRawFinappData(id_finapp:number){
    //console.log("Values before get request:",idFinappValues)
    //const id_finapp= idFinappValues[1];
    const id_finapp_detector= 1;

    const finappUrl="https://www.finapptech.com/finapp/api/getCSV_id.php?ID="+id_finapp+"=&D="+id_finapp_detector;
    //console.log(finappUrl)
    const response= await axios.get(finappUrl)

    const data= response.data
    return data
}
*/
//FUNCTION IMPLEMENTED WITH THE REPRESENTATION OF FIRST DATA COLLECTED BY THE SENSOR
/*
async function main() {
    console.log("Starting program");
    const data = await getRawFinappData();
    const firstDate = findFirstDate(data);
    console.log("First date of recording:", firstDate);
    console.log("Received " + (data.length / 1000) + " Kilobytes");
    console.log("Finished program");
}

async function getRawFinappData() {
    const id_finapp = 67;
    const id_finapp_detector = 1;
    const FinappUrl = "https://www.finapptech.com/finapp/api/getCSV_id.php?ID=" + id_finapp + "=&D=" + id_finapp_detector;
    const response = await axios.get(FinappUrl);
    const data = response.data;
    return data;
}

function findFirstDate(csvData: string) {
    const lines = csvData.trim().split('\n'); // Split data into lines
    if (lines.length > 1) {
        // Assuming the date is in the first column of the second row (after skipping the header)
        const columns = lines[1].split(',');
        const dateStr = columns[0].trim();
        return dateStr;
    } else {
        return "No data found";
    }
}

main();
*/
