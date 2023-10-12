import FinAppClient from "./client/FinAppClient";
import { FinAppData } from "./client/FinAppClient";
import NmDbClient from "./client/NmdbClient";
import { JungData } from "./client/NmdbClient";
import { spawn } from "child_process";
import { EventEmitter } from "stream";

import {runModel } from "./model/spawnUtils/neutronCount2SoilMoisture";
import neutronCount2SoilMoisture from "./model/spawnUtils/neutronCount2SoilMoisture";
import { read_csv_from_string } from "./utils/CsvParser";
//console.log("CIAO")


main()

async function main(){
    const jclient= new NmDbClient();
    const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");
    
    console.log("** FETCHING DATA FROM API")
    //TODO: CHE DATA METTO IN JUNG?
    const jungData= await jclient.getRawData("JUNG","2023-06-10","2023-10-12");
    console.log("Received",jungData.length,"Bytes from Jung")
    const finappData= await fclient.getRawFinappData(67); 
    console.log("Received",finappData.length,"Bytes from Finapp")

    
    const modelOutput= await neutronCount2SoilMoisture(jungData,finappData)
    console.log("Output:",modelOutput.length)

    const csvOut= await read_csv_from_string(modelOutput,",");
    console.log(Object.keys(csvOut))

    //TODO: Calcola media del soil moisture con le date giuste (24 ore del giorno prima) 
    let soilMoistureMean=0;
    //...

}




/*
main()
async function main(){
    console.time("R execution time")
    
    const command="Rscript";
    const scriptPath="hello.R";
    const wd="./src/model"
    const result=spawnSync(command,[scriptPath],wd)
    //console.log(result)
    console.timeEnd("R execution time")
    //expect(result).toBe("exited!")
}

function spawnSync(command:string,args:string[],working_dir:string){
    
    const child= spawn(command,args,{cwd:"./src/model"});
    child.stdout.on('data', (data) => {
        console.log(`R Output: ${data}`);
    });
      
    child.stderr.on('data', (data) => {
        console.error(`R Error: ${data}`);
    });
    
    child.on("exit",()=>{
        
    })
    

    
    let fullData=""

    
    return new Promise((resolve,reject)=>{

        const child= spawn(command,args,{cwd:working_dir});
        child.stdout.on('data', (data) => {
            console.log(`R Output: ${data}`);
            fullData=fullData+data
        });
          
        child.stderr.on('data', (data) => {
            console.error(`R Error: ${data}`);
            reject(data);
        });
    
        child.on("exit",()=>{
            resolve(fullData);
        })

    })
    
}
*/


/*
console.log("MAO")

const emettitore= new EventEmitter();

emettitore.on("qualcosa",()=>{
    console.log("HO ASCOLTATO UN EVENTO!")
})

emettitore.on("notification",(dati:any)=>{
    console.log("Ho ricevuto una notifica:",dati)
})
emettitore.emit("qualcosa")
emettitore.emit("notification",1)


console.log("FINITO IL CODICE")
*/


/*
// Set the working directory to the location of your R script
const workingDirectory = 'C:/Users/fravi/Documents/Tirocinio/';
process.chdir(workingDirectory);


// Define the Rscript command and the path to your R script
const command = 'Rscript';
const scriptPath = 'C:/Users/fravi/Documents/Tirocinio/processing_imola_v0001.R';  

// Spawn the Rscript process
const child = spawn(command, [scriptPath]);

// Listen for data from the R process (stdout and stderr)
child.stdout.on('data', (data) => {
  console.log(`R Output: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`R Error: ${data}`);
});
 */



/*
main();

async function main() {

    const client= new NmDbClient();
    const data= await client.getJungDataOfToday()
    console.log(data)
}




*/

//ABBIAMO FATTO 3 COSE: FETCH DATA, PREPROCESS DATA (clean,parse), PROCESS DATA (model)


/*testSpawn()


async function testSpawn(){
    console.log("I AM SPAWNING A TERMINAL COMMAND!")
    
    //TODO: al posto di "dir" mi devi lanciare Rscript ./hello.r
    const command="dir"

    const child = spawn('cmd.exe', ["/c",command]);

    child.stdout.on('data', data => {
      console.log(`stdout:\n${data}`);
    });
    
    child.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });

}

*/


//main();
/*
async function main() {
    console.log("STARTING PROGRAM")

    const currentDatetime: Date = new Date();

    // Calculate the midnight of yesterday
    const midnightYesterday: Date = new Date(currentDatetime);
    midnightYesterday.setDate(currentDatetime.getDate() - 1);
    //midnightYesterday.setHours(0, 0, 0, 0);
    const yesterday=midnightYesterday.toISOString().split("T")[0]
    console.log(yesterday)

    // Calculate the midnight of today
    const midnightToday: Date = new Date(currentDatetime);
    const today=midnightToday.toISOString().split("T")[0]
    console.log(today)

    //TODO[0]: trovami la data corrispondente alla mezzanotte di ieri e di oggi
    let startDate=yesterday //mezzanotte di ieri
    let stopDate=today //mezzanotte di stamattina

    //1. GET FINAPP DATA (json con colonne, non la stringa!!!)
    const excelPath='./resources/id_sensor_baroni.csv';
    const finappClient= new FinAppClient(excelPath);
    const finappData= await finappClient.getFinappData(1)
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
    let fetta1=[]


    //2. GET JUNG DATA (json con colonne)
    const jungClient= new NmDbClient();
    //TODO[2]: instead of today's data, get previous day data starting from 00:00
    const jungData= await jungClient.getJungData(yesterday,yesterday)//getJungDataOfToday();
    console.log(jungData)
    let fetta2=[]

    //3. APPLY MODEL
    //TODO[3]: scrivi modello di correzione

    console.log("PROGRAM FINISHED")
} 


function applyCorrections(jungData:JungData,finappData:FinAppData):number{
    
    console.log("Jung dates:",jungData.Datetime)
    const totDates=finappData["#Datetime"].length
    console.log("Finapp dates:",finappData["#Datetime"][totDates-1])

    return 0
}

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



