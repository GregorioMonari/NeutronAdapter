import { CronJob } from "cron"
import * as fs from 'fs'
const log = require("greglogs").default

import { UnitBinding } from '../types/unit-interface';
import SensorDataProducer from "../pac/producers/SensorDataProducer";
import NmDbClient from "../client/NmdbClient";
import FinAppClient from "../client/FinAppClient";
import neutronCount2SoilMoisture, { calculateSMYesterday } from "../model/spawnUtils/neutronCount2SoilMoisture";
import SensorConsumer from "../pac/consumers/SensorConsumer";
import SensorGraphCleaner from "../pac/producers/SensorGraphCleaner";
import { Producer } from "pacfactory/build/core/Pattern/Producer";


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
        //Get schedule time
        const minute=time.split(":")[1]
        const hour=time.split(":")[0]

        //Cron job configuration
        const cronPattern= minute+' '+hour+' * * *'; //start time of job
        const executeJob = async ()=>{ //function to execute on start time
            //const startTime=performance.now()
            log.info("Executing job for featureOfInterest:",foi)

            //1. GET DATA
            console.log("** Fetching data from Api")
            const jclient= new NmDbClient();
            const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");
            const today = new Date();
            const isoDate = today.toISOString().split('T')[0];
            const jungData= await jclient.getRawData("JUNG","2023-04-01",isoDate);
            console.log("Received",jungData.length,"Bytes from Jung") 
            const finappData= await fclient.getRawFinappData(67); 
            console.log("Received",finappData.length,"Bytes from Finapp")
        
            //2. APPLY MODEL
            console.log("** Applying model")
            const csvOut= await neutronCount2SoilMoisture(jungData,finappData)
            //console.log("Output:",modelOutput.length)
        
            //3. CALCULATE MEAN
            console.log("** Calculating soil moisture mean")
            const SMmean = await calculateSMYesterday(csvOut);
        

            console.log("- Soil Moisture Mean of the Previous Day: " + SMmean); 
            
        }


        //Create cron job
        const job= new CronJob(cronPattern,executeJob,null,true,"utc")
        this.activeJobs.push(job)
    }
} 





/* 
            
            
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