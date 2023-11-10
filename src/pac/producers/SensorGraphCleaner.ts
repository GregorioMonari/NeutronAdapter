import { Producer } from "pacfactory";
export default class SensorGraphCleaner extends Producer{
    constructor(jsap:any){
        super(jsap,"cleanSensorData")
    }

    async cleanSensor(){
        await this.updateSepa({
            graph:"criteria:sensors"
        });
    } 

}