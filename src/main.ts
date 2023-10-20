import FinAppClient from "./client/FinAppClient";
import { FinAppData } from "./client/FinAppClient";
import NmDbClient from "./client/NmdbClient";
import { JungData } from "./client/NmdbClient";
import { spawn } from "child_process";
import { EventEmitter } from "stream";

import {runModel } from "./model/spawnUtils/neutronCount2SoilMoisture";
import neutronCount2SoilMoisture from "./model/spawnUtils/neutronCount2SoilMoisture";
import { read_csv_from_string } from "./utils/CsvParser";
import { DateTime } from "luxon";
import { CronJob } from "cron";

//console.log("CIAO")
/*
TODO: 
1- metti media del soil moisture nella funzione getSoilMOistureMean
2- scrivere il tipo dell'ouput del modello
3- converti da unitTime a cronPattern
4- stampa il valore del sensor id+orario corrente da DENTRO il cron job

*/


const cronPatterns={
    "every5seconds":"*/5 * * * * *",
    "every10seconds":"*/10 * * * * *",
    "everyDayAt-currTimeZone":"25 14 * * *",
    "everyDayAt-UTC":"27 12 * * *",
}

function task(){
    const date= new Date()
    console.log("Cron job started at",date.toISOString())
}


main()


async function main(){
    console.log("MAIN STARTED")
}


/*
async function main(){
    console.log("MAIN STARTED")

    const unitTime="11:30"
    const sensorId="JUNG.67"

    const job= new CronJob(cronPatterns["every10seconds"],task,null,false,"UTC");
    job.start()
}
*/

/*
async function main(){
    const jclient= new NmDbClient();
    const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    console.log("** FETCHING DATA FROM API")
    //TODO: CHE DATA METTO IN JUNG?
    const jungData= await jclient.getRawData("JUNG","2023-04-01",isoDate);
    console.log("Received",jungData.length,"Bytes from Jung") 
    const finappData= await fclient.getRawFinappData(67); 
    console.log("Received",finappData.length,"Bytes from Finapp")

    
    const csvOut= await neutronCount2SoilMoisture(jungData,finappData)
    //console.log("Output:",modelOutput.length)



    //console.log(Object.keys(csvOut))
    //console.log(csvOut.SM)
    //console.log(typeof csvOut) 
    //console.log(csvOut.DateTime)
    // Access the CSV data property from the object
    

    //----------------------------------------------------------
    // Calculate the date for yesterday
    const yesterdayDateObj = new Date(today);
    yesterdayDateObj.setDate(today.getDate() - 1); 
    //console.log(yesterdayDateObj)
    const yesterday= yesterdayDateObj.toISOString().split("T")[0]
    console.log(yesterday)

    //EXTRACT DATES COLUMN FROM CSV
    const dates= csvOut["DateTime"]
    //console.log(dates[0])

    //EXTRACT SM COLUMN FROM CSV
    const SM= csvOut.SM
    const SMYesterday= []

    let startIndex=0;
    let stopIndex=0;
    let currIndex=0;
    for(const date of dates){
        const day= date.split("T")[0]
        //console.log(" ")
        //console.log(day)
        //console.log(yesterday)
        if(day==yesterday){
            console.log("FOUND! at index:"+currIndex)
            const SMvalue= SM[currIndex]
            SMYesterday.push(SMvalue)
        }
        currIndex++
    }
    console.log(SMYesterday)

    let sum = 0;

    for (let i = 0; i < SMYesterday.length; i++) {
    sum += parseFloat(SMYesterday[i]);
    }

    const SMmean= sum/SMYesterday.length

    console.log(SMmean)

    //console.log(currIndex)
    


    // Format the date for yesterday in the same format as your data
    //const formattedDate = yesterday.toISOString().split('T')[0];
    //console.log(formattedDate)

   

    //const index = csvOut.Datetime.indexOf(formattedDate);

    // Get the corresponding "SM" value for yesterday
    //const SMYesterday = csvOut.SM[index];

    //console.log(SMYesterday);     
        
    



    //TODO: Calcola media del soil moisture con le date giuste (24 ore del giorno prima) 
    //let soilMoistureMean=0;
    //...

}
*/

