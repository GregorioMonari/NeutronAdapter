const log = require("greglogs").default

import PlaceProducer from "../pac/producers/PlaceProducer";
import CronScheduler from "./CronScheduler";


export default class NeutronAdapter {
    //private unitsConsumer:UnitsConsumer;
    private cronManager: CronScheduler;
    private placeProducer: PlaceProducer;

    constructor(jsap:any){
        this.cronManager= new CronScheduler(jsap);
        this.placeProducer = new PlaceProducer(jsap)
    }

    //Start the application
    public async start(){
        console.log("Starting adapter...")

        //1. CREATE FOI
        var place="vaimee:Imola";
        var name="ImolaStation";
        var lat="44.384809"; 
        var long="11.698777";

        await this.placeProducer.updateSepa({
            name:name,        
            id:place,      
            lat:lat,          
            lon:long        
        })

        //2. START CRON JOB
        var time="11:09"; 
        await this.cronManager.addJob(place,time);
    }

    async stop(){} //TODO: stop application

} 