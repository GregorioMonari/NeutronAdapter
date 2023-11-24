import { Producer } from "pacfactory";
export default class SensorDataProducer extends Producer{
    constructor(jsap:any){
        super(jsap,"uploadCriteriaSensorData")
    }
}