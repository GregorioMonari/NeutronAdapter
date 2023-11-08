import { Producer } from "pacfactory";
export default class GraphCleaner extends Producer{
    constructor(jsap:any){
        super(jsap,"deleteGraphContent")
    }

    async cleanPlants(){
        await this.updateSepa({
            graph:"agri:Plants"
        });
    }

}