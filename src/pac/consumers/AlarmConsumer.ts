import { Consumer } from "pacfactory";
export default class AlarmConsumer extends Consumer{
    constructor(jsap:any){
        const queryName="getAlarm"
        const bindings={}
        super(jsap,queryName,bindings)
    }
}
