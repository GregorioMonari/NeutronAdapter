import { CronJob } from "cron"
import * as fs from 'fs'
const log = require("greglogs").default

import { UnitBinding } from '../types/unit-interface';
import SensorDataProducer from "../pac/producers/SensorDataProducer";


export default class CronScheduler{
    private activeJobs:CronJob[];
    private jsap:any;
    
    constructor(_jsap:any){
        this.jsap=_jsap;
        this.activeJobs=[];
    }

    public async addJob(unit:UnitBinding){
        //qui metto le proprietà della unit che ci interessano
        const unitId=unit.id;
        const sensorId=unit.sensorId;
        const time=unit.time;
        log.info("Adding cron job for unit:",unitId,"|| sensorId:",sensorId,"|| time:",time)
        
        //*Get schedule time
        const minute=time.split(":")[1]
        const hour=time.split(":")[0]

        //*Create cron job
        const job= new CronJob(minute+' '+hour+' * * *',async function(){
            const startTime=performance.now()
            log.info("Executing job for unit:",unitId)
            
            //TODO: ADD MISSING CODE!
            //1. Api call
            //2. Apply model
            //3. Calculate mean
            //4. Update sensor data to sepa with producer (with the right date)
            
            
            const stopTime=performance.now()
            log.info("Completed cron job for unit:",unitId," | execution time: "+(stopTime-startTime)+"ms")
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