import axios from 'axios'
import { read_csv_from_path, read_csv_from_string } from './utils/CsvParser';

/*
//STUDIA ESEMPIO https://www.npmjs.com/package/csv-parse PER IL CSV!!!!

ESEMPIO READ CSV ASINCRONO
const fs = require('fs')
var parse = require('csv-parse')
fs.readFile(inputPath, function (err, fileData) {
  parse(fileData, {columns: false, trim: true}, function(err, rows) {
    // Your CSV data is in an array of arrys passed to this callback as rows.
  })
})

- invece usa const string= fs.readFileSync()

*/
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

async function main() {
    try {
        console.log("Starting program");

        // Fetch Jung data
        const data = await getJungDataOfToday();

        // Clean and process the data
        const cleanedDataHeader = cleanJungData(data);
        //console.log(cleanedDataHeader);

        console.log("Received " + (data.length / 1000) + " Kilobytes");
        console.log("Finished program");

         
        //console.log(data)
        const csvData= await read_csv_from_string(cleanedDataHeader,";");
        console.log(csvData)
        //console.log("Received "+(data.length/1000)+" Kilobytes")
        console.log("finished program")
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function getJungDataOfToday() {
    const now = new Date();
    const stringDate = now.toISOString();
    const arr = stringDate.split("T");
    const stopDate = arr[0];

    return await getJungData(stopDate, stopDate);
}

async function getJungData(startDate: string, stopDate: string) {
    const station = "JUNG";
    const data = await getRawApiData(station, startDate, stopDate);
    return data;
}

function cleanJungData(data: string) {
    const dataArr = data.split(/\s+start_date_time\s+RCORR_E/);
    const cleanedRawData = dataArr[1].trim();
    const dataArr1= cleanedRawData.split("</code>")
    const cleanedData = dataArr1[0].trim()
    const cleanedDataHeader = "Datetime;RCORR_E"+"\n"+cleanedData
    return cleanedDataHeader
}
  

//RITORNA I DATI IN UN INTERVALLO TEMPORALE GENERICO DI UNA STAZIONE GENERICA
async function getRawApiData(station:string,startDate:string,stopDate:string){

    //PARSE DATES
    const startDateArr= startDate.split("-");
    //console.log(startDateArr)
    const stopDateArr= stopDate.split("-");
    //console.log(stopDateArr)
    const T_ini_d=startDateArr[2];
    const T_ini_m=startDateArr[1];
    const T_ini_y=startDateArr[0];
    const T_end_d=stopDateArr[2];
    const T_end_m=stopDateArr[1];
    const T_end_y=stopDateArr[0];

    //MAKE REQUEST
    const url= "http://nest.nmdb.eu/draw_graph.php?formchk=1&stations[]="+station+"&tabchoice=revori&dtype=corr_for_efficiency&tresolution=60&yunits=0&date_choice=bydate&start_day=" + T_ini_d + "&start_month=" + T_ini_m + "&start_year=" + T_ini_y + "&start_hour=0&start_min=0&end_day=" + T_end_d + "&end_month=" + T_end_m + "&end_year=" + T_end_y + "&end_hour=23&end_min=59&output=ascii";
    const response= await axios.get(url)
    //CHECK DATA INTEGRITY
    const data:string=response.data
    if(data.includes("Sorry, no data available")) throw new Error("Sorry, no data available")

    return data

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
/*
const array=[1,2,3,4]
for(var i=0; i<4; i++){
    console.log(array[i])
}

for(const i in array){
    console.log(array[i])
}
for(const entry of array){
    console.log(entry)
}
array.forEach(entry=>{
    console.log(entry)
})
const json:any={
    "nome":"mario",
    "età":24
}
Object.keys(json).forEach((k:any)=>{
    console.log(json[k])
})
*/

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



