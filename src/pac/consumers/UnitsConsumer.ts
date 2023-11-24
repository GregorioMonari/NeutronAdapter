import { Consumer } from "pacfactory";

export default class UnitsConsumer extends Consumer{
    constructor(jsap:any){
        const queryName="UNITS"
        const subBindings={}
        super(jsap,queryName,subBindings)
    }
}