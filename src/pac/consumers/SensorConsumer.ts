import { Consumer } from "pacfactory";
export default class SensorConsumer extends Consumer{
    constructor(jsap:any){
        const queryName="GET_SENSOR_DATA"
        const bindings={}
        super(jsap,queryName,bindings)
    }
}