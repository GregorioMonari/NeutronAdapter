const log = require("greglogs").default
import NeutronAdapterCommandLineParser from "../utils/NeutronAdapterCommandLineParser";
import PlaceConsumer from "../pac/consumers/PlaceConsumer";
import PlaceProducer from "../pac/producers/PlaceProducer";
import CronScheduler from "./CronScheduler";


export default class NeutronAdapter {
    private cronManager: CronScheduler;
    private placeProducer: PlaceProducer;
    private placeConsumer: PlaceConsumer;

    constructor(jsap:any){
        this.cronManager= new CronScheduler(jsap);
        this.placeProducer = new PlaceProducer(jsap);
        this.placeConsumer = new PlaceConsumer(jsap);
    }

    private async placeExists(id: string): Promise<boolean>{
        const results= await this.placeConsumer.querySepaWithBindings({
            id: id
        }) 
        return results.length!=0
    }

    public async start(){ //starts the application
        //1. Create FOI (if it doesn't exist)
        var place="vaimee:Imola";
        var name="ImolaStation";
        var lat="44.384809"; 
        var long="11.698777";
        const placeExists= await this.placeExists(place); //ask if place exists
        if(!placeExists){
            await this.placeProducer.updateSepa({
                name:name,        
                id:place,      
                lat:lat,          
                lon:long        
            });
            log.info("Created feature of interest:",place);
        }else{
            log.info("Skipping creation of feature of interest '"+place+"' because it already exists.");
        }

        //2. Get UPDATE TIME
        const cmdParser= new NeutronAdapterCommandLineParser();
        const argsMap= cmdParser.parse();
        const updateTime= argsMap.update_time? argsMap.update_time : 
            process.env["update_time"]? process.env["update_time"]: "4:00";

        //3. Start CRON JOB
        await this.cronManager.addJob(place, updateTime as string);
        log.info("Adapter is up and running!");
    }

    public async stop(){} //TODO: stop application

} 