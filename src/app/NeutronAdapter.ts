const log = require("greglogs").default

import PlaceProducer from "../pac/producers/PlaceProducer";
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
        var name="ImolaStation";
        var lat="44.384809"; 
        var long="11.698777";

        const placeProducer = new PlaceProducer(this.jsap)
        placeProducer.updateSepa({
            name:name,        
            id:place,      
            lat:lat,          
            lon:long        
        })
        

        //2. START IMOLA CRON JOB
        //place: id, name, lat, long
        var time="10:41"; 
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