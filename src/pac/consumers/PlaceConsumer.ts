import { Consumer } from "pacfactory";
export default class PlaceConsumer extends Consumer{
    constructor(jsap:any){
        const queryName="GET_PLACES"
        const bindings={}
        super(jsap,queryName,bindings)
    }
}
