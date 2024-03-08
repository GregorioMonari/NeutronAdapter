import { CronJob } from "cron"
const log = require("greglogs").default
import NmDbClient from "../client/NmdbClient";
import FinAppClient from "../client/FinAppClient";
import neutronCount2SoilMoisture, { calculateSMYesterday } from "../model/spawnUtils/neutronCount2SoilMoisture";
import SoilMoistureProducer from "../pac/producers/SoilMoistureProducer";


export default class CronScheduler{
    private activeJobs:CronJob[];
    private soilMoistureProducer: SoilMoistureProducer;

    constructor(_jsap:any){ 
        this.activeJobs=[];
        this.soilMoistureProducer = new SoilMoistureProducer(_jsap)
    }

    public getActiveJobs(){return this.activeJobs}

    //Applico il modello daily, partendo dai dati del giorno prima
    //M(jung,finapp) -> N (soil moisture)
    public async addJob(foi:string,time:string){
        log.info("Adding cron job for featureOfInterest:",foi,"|| time:",time)
        
        //*Get schedule time
        const minute=time.split(":")[1]
        const hour=time.split(":")[0]

        //*Create cron job
        const job= new CronJob(minute+' '+hour+' * * *', async () => {
            log.info("Executing job for featureOfInterest:",foi)
            
            //1. FETCH DATA FROM API
            const jungClient= new NmDbClient();
            const finAppClient= new FinAppClient("../resources/id_sensor_baroni.csv");
            const today = new Date();
            const isoDate = today.toISOString().split('T')[0];
            console.log("** FETCHING DATA FROM API")
            const jungData= await jungClient.getRawData("JUNG","2023-04-01",isoDate);
            console.log("Received",jungData.length,"Bytes from Jung") 
            const finappData= await finAppClient.getRawFinappData(67); 
            console.log("Received",finappData.length,"Bytes from Finapp")
        
            //2. APPLY MODEL
            const csvOut= await neutronCount2SoilMoisture(jungData,finappData)   
            const SMmean = await calculateSMYesterday(csvOut);
            console.log("Soil Moisture Mean of the Previous Day: " + SMmean); 
            
            //3. UPDATE SEPA
            const {formattedDate,formattedPrevDate}=getUpdateTimestamps();
            var property="criteriaProperty:SoilMoisture";
            var unit="unit:Number";
            await this.soilMoistureProducer.updateSepa({
                feature:foi,
                property:property,
                time:formattedDate,
                ptime:formattedPrevDate,
                unit:unit,
                value:SMmean

            })
        })
        this.activeJobs.push(job)
    }
}


function getUpdateTimestamps(){
    // Get current date
    var currentDate = new Date();
    // Extract year, month, and day
    var year = currentDate.getFullYear();
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month index
    var day = ("0" + currentDate.getDate()).slice(-2);
    // Format the date
    var formattedDate = year + " - " + month + " - " + day;
    console.log("Current Date:", formattedDate);

    // Create a new Date object for the current date
    var prevDate = new Date(currentDate);
    // Subtract one day from the current date
    prevDate.setDate(prevDate.getDate() - 1);
    // Extract year, month, and day from the previous date
    var prevYear = prevDate.getFullYear();
    var prevMonth = ("0" + (prevDate.getMonth() + 1)).slice(-2);
    var prevDay = ("0" + prevDate.getDate()).slice(-2);
    // Format the previous date
    var formattedPrevDate = prevYear + " - " + prevMonth + " - " + prevDay;
    console.log("Previous Date:", formattedPrevDate);
    return {formattedDate,formattedPrevDate};
}