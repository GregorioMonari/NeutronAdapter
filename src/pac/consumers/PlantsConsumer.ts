import { Consumer } from "pacfactory";
export default class WeedsConsumer extends Consumer{
    constructor(jsap:any){
        const queryName="getPlantsNamesAndColors"
        const bindings={}
        super(jsap,queryName,bindings)
    }
}
