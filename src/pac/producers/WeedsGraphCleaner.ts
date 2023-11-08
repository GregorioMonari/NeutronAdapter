import { Producer } from "pacfactory";
export default class WeedsGraphCleaner extends Producer{
    constructor(jsap:any){
        super(jsap,"deleteGraphContent")
    }

    async cleanWeeds(){
        await this.updateSepa({
            graph:"agri:Weeds"
        });
    } 

}