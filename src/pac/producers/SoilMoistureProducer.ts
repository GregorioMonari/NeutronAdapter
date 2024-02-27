import { Producer } from "pacfactory";
export default class SoilMoistureProducer extends Producer{
    constructor(jsap:any){
        super(jsap,"ADD_OBSERVATION")
    }
}