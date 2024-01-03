const log = require("greglogs").default

import CronScheduler from "./CronScheduler";

export default class NeutronAdapter {
    //private unitsConsumer:UnitsConsumer;
    private cronManager:CronScheduler;


    constructor(jsap:any){
        /*
        this.unitsConsumer= new UnitsConsumer(jsap);
        this.unitsConsumer.getEmitter().on("firstResults",(not:any)=>{
            const results= not.getBindings();
            
            this.onAddedUnit(results).catch(e=>{
                log.warning("FAILED TO ADD UNIT SCHEDULE")
                console.log(e)
            })
        })
        this.unitsConsumer.getEmitter().on("addedResults",(not:any)=>{
            const results= not.getBindings();
            this.onAddedUnit(results).catch(e=>{
                log.warning("FAILED TO ADD UNIT SCHEDULE")
                console.log(e)
            })
        })
        */
        this.cronManager= new CronScheduler(jsap);
    }

    //Start the application
    public async start(){

        //1. CREATE FOI
        //2. Start cron jobs
        var foi="testFoi";
        var sensorId="testSensorId";
        var time="12:51";
        await this.cronManager.addJob(foi,sensorId,time);

    }
    
    //Stops the application
    public stop(){}

    //Get all currently running cron jobs
    public getActiveJobs(){
        return this.cronManager.getActiveJobs()
    }






    //!------OUTDATED------------------------------------------------------------------------------
    /*
    async start_OLD(){
        this.unitsConsumer.subscribeToSepa();
        //this.testSchedule()
    }
    async stop_OLD(){
        this.unitsConsumer.stop();
        this.cronManager.stopAllJobs();
    }
    //ADD CRON JOBS TO SCHEDULE
    private async onAddedUnit(not:any){
        //console.log(not)     
        for(const binding of not){
            if(this.isUnitValid(binding)){
                const unit=binding as UnitBinding;
                log.trace(`Received new Unit binding:`,unit)
                this.cronManager.addJob(unit); //?QUI CREO UN NUOVO CRON JOB!!!!!!!
            }else{
                log.trace("Skipped invalid unit")
            }
        }
    }
    private isUnitValid(binding: unknown) {
        if (binding == null) return false;
        if (typeof binding !== 'object') return false;
    
        if (!binding.hasOwnProperty("id")) return false;
        if (!binding.hasOwnProperty("crop")) return false;
        if (!binding.hasOwnProperty("soil")) return false;
        if (!binding.hasOwnProperty("meteo")) return false;
        if (!binding.hasOwnProperty("numerical")) return false;
        if (!binding.hasOwnProperty("fitting")) return false;
        if (!binding.hasOwnProperty("isSensorActive")) return false;
        
        const bd= binding as UnitBinding
        if(bd.isSensorActive||bd.isSensorActive=="true"){//se il sensore è attivo
            if (!binding.hasOwnProperty("sensorId")) return false;
            if (!binding.hasOwnProperty("sensorType")) return false;
            if (!binding.hasOwnProperty("time")) return false;
            if(typeof bd.sensorType!=typeof "string") return false;
        }else{
            return false
        }
        if(bd.sensorType!="SATELLITE") return false
        
        return true; 
    }
    //remove unit from SCHEDULE
    async onRemovedUnit(not:any){}
    async testWithUnits_OUTDATED(){
        this.onAddedUnit([
            {
                id:"vaimee:Imola",
                crop:"GRAPE",
                soil:"2",
                meteo:"vaimee:ImolaWeather",   
                numerical:"1",
                fitting:"1",
                isSensorActive:"true",             
                time:"10:59", 
                sensorType:"CNRS",
                sensorId:"JUNG.67"
            },
            {
                id:"vaimee:Imola2",
                crop:"POTATO",
                soil:"2",
                meteo:"vaimee:ImolaWeather",   
                numerical:"1",
                fitting:"1",
                isSensorActive:"true",             
                time:"10:59", 
                sensorType:"CNRS",
                sensorId:"JUNG.67" 
            }
            
            ,
            {
                time:"11:30",
                id:"vaimee:Chile2",
                sensorType:"SATELLITE",
                sensorId:"c58cb4a1-a593-47c9-a799-14c5b8992839"
            },
            {
                time:"11:30",
                id:"vaimee:Flevoland",
                sensorType:"SATELLITE",
                sensorId:"ebf35b8e-9ff8-45d2-a589-05967dde1fee"
            },
            {
                time:"11:30",
                id:"vaimee:Schoonoord",
                sensorType:"SATELLITE",
                sensorId:"815a6081-36b3-4245-aaad-a9bc8230e966"
            }
        ])
    }
    */
}