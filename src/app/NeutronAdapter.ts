const log = require("greglogs").default

import CronScheduler from "./CronScheduler";

export default class NeutronAdapter {
    //private unitsConsumer:UnitsConsumer;
    private cronManager:CronScheduler;
    private jsap:any;

    constructor(jsap:any){
        this.cronManager= new CronScheduler(jsap);
        this.jsap=jsap;
    }

    //Start the application
    public async start(){
        console.log("Starting adapter...")

        //1. CREATE FOI
        var place="vaimee:Imola";
        var name="ImolaStation"
        var lat=""
        var long=""
        //TODO: Crea il producer partendo dalla query ADD_OBSERVATION
        /*const PlaceProducer = new PlaceProducer(this.jsap)
        PlaceProducer.updateSepa({
            ...
        })*/
         
        //2. START IMOLA CRON JOB
        //place: id, name, lat, long
        var time="15:44"; 
        await this.cronManager.addJob(place,time);
        
    }
    
    //-----------------------------UTLITIES--------------------------------------------------------------------
    //Stops the application
    public stop(){}

    //Get all currently running cron jobs
    public getActiveJobs(){
        //return this.cronManager.getActiveJobs()
    }
} 