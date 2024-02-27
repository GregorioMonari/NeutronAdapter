import { CronJob } from "cron"
import * as fs from 'fs'
const log = require("greglogs").default

import NmDbClient from "../client/NmdbClient";
import FinAppClient from "../client/FinAppClient";
import neutronCount2SoilMoisture, { calculateSMYesterday } from "../model/spawnUtils/neutronCount2SoilMoisture";
import SoilMoistureProducer from "../pac/producers/SoilMoistureProducer";


export default class CronScheduler{
    private activeJobs:CronJob[];
    private jsap:any;
    

    constructor(_jsap:any){ 
        this.jsap=_jsap;
        this.activeJobs=[];
        
    }

    //Applico il modello daily, partendo dai dati del giorno prima
    //M(jung,finapp) -> N (soil moisture)
    public async addJob(foi:string,time:string){
        log.info("Adding cron job for featureOfInterest:",foi,"|| time:",time)
        
        //*Get schedule time
        const minute=time.split(":")[1]
        const hour=time.split(":")[0]

        //*Create cron job
        const job= new CronJob(minute+' '+hour+' * * *', async () => {
            const startTime=performance.now()
            log.info("Executing job for featureOfInterest:",foi)
            
            /*
                D'ora in poi, ogni giorno nel momento specificato, il cron job esegue la sua funzione (applicare il modello che abbiamo adattato da R)
                1. Chiamare i dati delle API (JUNG e FINAPP) del giorno prima
                2. Applicare il modello R -> menata della spawn
                3. Con i dati in output del modello abbiamo fatto calculate mean
            */
            
            const jclient= new NmDbClient();
            const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");
            const today = new Date();
            const isoDate = today.toISOString().split('T')[0];
            console.log("** FETCHING DATA FROM API")
            const jungData= await jclient.getRawData("JUNG","2023-04-01",isoDate);
            console.log("Received",jungData.length,"Bytes from Jung") 
            const finappData= await fclient.getRawFinappData(67); 
            console.log("Received",finappData.length,"Bytes from Finapp")
       
            
            const csvOut= await neutronCount2SoilMoisture(jungData,finappData)
            //console.log("Output:",modelOutput.length)   
            const SMmean = await calculateSMYesterday(csvOut);
            console.log("Soil Moisture Mean of the Previous Day: " + SMmean); 
            
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
 

            var property="criteriaProperty:SoilMoisture";
            var unit="unit:Number";

            const soilMoistureProducer = new SoilMoistureProducer(this.jsap)
            soilMoistureProducer.updateSepa({
                feature:foi,
                property:property,
                time:formattedDate,
                ptime:formattedPrevDate,
                unit:unit,
                value:SMmean

            })
        })
    }
} /*
            
            
                    const sensorConsumer = new SensorConsumer(jsap);
                    const sensorGraphCleaner = new SensorGraphCleaner(jsap);
                    const sensorProducer = new Producer(jsap,"uploadCriteriaSensorData")
                    
            
                    await sensorGraphCleaner.cleanSensorData();
            
                    //sensorProducer.updateSepa({
                    //    date:"2021-10-15T03:03:00Z", 
                    //    value: "38.5",
                    //    portNumber:  "1",
                    //    layerNumber: "15",
                    //    sensorId:"2183891ui"
                    //})
                    
            
            
                    await wait(1000)
            
                    let queryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
                    console.log("QueryResult:",queryResult) 
            
                    sensorConsumer.on("firstResults",(not:any)=>{
                        //console.log(not)
                    })
                    sensorConsumer.on("addedResults",(not:any)=>{
                        const bindings=not.getBindings()
                        console.log("Umidità media giornaliera di ieri:",bindings)
                    })
                    sensorConsumer.on("removedResults",(not:any)=>{
                        //console.log(not)
                    })
                    
                    sensorConsumer.subscribeToSepa()
            
                    await wait(2000)
            
                    await sensorProducer.updateSepa({
                        date:"2021-10-15T03:03:00Z", 
                        value: SMmean,
                        portNumber:  "1",
                        layerNumber: "15",
                        sensorId:"2183891ui"
                    })
                    
                    await wait(2000)
                    let realQueryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
                    console.log("QueryResult:",queryResult) 
                }
            

            //TODO: Quando hai finito parte precedente gestiamo FOI + sepa update
            //4. Update sensor data to sepa with producer (with the right date)
            
            const stopTime=performance.now()
            log.info("Completed cron job for featureOfInterest:",foi," | execution time: "+(stopTime-startTime)+"ms")
        },null,false,"UTC")
        job.start(); 
        this.activeJobs.push(job)
    }


    public getNumberOfActiveJobs(){
        return this.activeJobs.length
    }
    public getActiveJobs(){
        return this.activeJobs;
    }
    public stopAllJobs(){
        this.activeJobs.forEach(job=>{
            job.stop();
        })
        this.activeJobs=[];
    }


}



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


    const SMmean = await calculateSMYesterday(csvOut);

    console.log("Soil Moisture Mean of the Previous Day: " + SMmean); 


        const sensorConsumer = new SensorConsumer(jsap);
        const sensorGraphCleaner = new SensorGraphCleaner(jsap);
        const sensorProducer = new Producer(jsap,"uploadCriteriaSensorData")
        

        await sensorGraphCleaner.cleanSensorData();

        //sensorProducer.updateSepa({
        //    date:"2021-10-15T03:03:00Z", 
        //    value: "38.5",
        //    portNumber:  "1",
        //    layerNumber: "15",
        //    sensorId:"2183891ui"
        //})
        


        await wait(1000)

        let queryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
        console.log("QueryResult:",queryResult) 

        sensorConsumer.on("firstResults",(not:any)=>{
            //console.log(not)
        })
        sensorConsumer.on("addedResults",(not:any)=>{
            const bindings=not.getBindings()
            console.log("Umidità media giornaliera di ieri:",bindings)
        })
        sensorConsumer.on("removedResults",(not:any)=>{
            //console.log(not)
        })
        
        sensorConsumer.subscribeToSepa()

        await wait(2000)

        await sensorProducer.updateSepa({
            date:"2021-10-15T03:03:00Z", 
            value: SMmean,
            portNumber:  "1",
            layerNumber: "15",
            sensorId:"2183891ui"
        })
        
        await wait(2000)
        let realQueryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
        console.log("QueryResult:",queryResult) 
    }


*/ 