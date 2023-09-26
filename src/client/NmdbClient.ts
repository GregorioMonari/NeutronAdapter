import axios from 'axios'
import { read_csv_from_path, read_csv_from_string } from '../utils/CsvParser';


export interface JungData{
    Datetime:string[];
    RCORR_E:string[];
}


export default class NmDbClient{

    constructor(){}

    /**
     * Get today's data from JUNG station
     * @returns 
     */
    public async getJungDataOfToday() {
        const now = new Date();
        const stringDate = now.toISOString();
        const arr = stringDate.split("T");
        const stopDate = arr[0];
    
        return await this.getJungData(stopDate, stopDate);
    }
    
    /**
     * Returns parsed data from JUNG station
     * @param startDate 
     * @param stopDate 
     * @returns 
     */
    public async getJungData(startDate: string, stopDate: string): Promise<JungData> {
        const station = "JUNG";
        const rawData = await this.getRawData(station, startDate, stopDate);
        const cleanData= this.cleanRawData(rawData);
        const json= read_csv_from_string(cleanData,";")
        return json;
    }
    



    private cleanRawData(data: string):string {
        const dataArr = data.split(/\s+start_date_time\s+RCORR_E/);
        const cleanedRawData = dataArr[1].trim();
        const dataArr1= cleanedRawData.split("</code>")
        const cleanedData = dataArr1[0].trim()
        const cleanedDataHeader = "Datetime;RCORR_E"+"\n"+cleanedData
        return cleanedDataHeader
    }

    /**
     * Get raw api data in string form from nmdb. 
     * Allowed stations: JUNG, JUNG1
     * @param station 
     * @param startDate 
     * @param stopDate 
     * @returns 
     */
    async getRawData(station:string,startDate:string,stopDate:string):Promise<string>{
        //PARSE DATES
        const startDateArr= startDate.split("-");
        //console.log(startDateArr)
        const stopDateArr= stopDate.split("-");
        //console.log(stopDateArr)
        const T_ini_d=startDateArr[2];
        const T_ini_m=startDateArr[1];
        const T_ini_y=startDateArr[0];
        const T_end_d=stopDateArr[2];
        const T_end_m=stopDateArr[1];
        const T_end_y=stopDateArr[0];
    
        //MAKE REQUEST
        const url= "http://nest.nmdb.eu/draw_graph.php?formchk=1&stations[]="+station+"&tabchoice=revori&dtype=corr_for_efficiency&tresolution=60&yunits=0&date_choice=bydate&start_day=" + T_ini_d + "&start_month=" + T_ini_m + "&start_year=" + T_ini_y + "&start_hour=0&start_min=0&end_day=" + T_end_d + "&end_month=" + T_end_m + "&end_year=" + T_end_y + "&end_hour=23&end_min=59&output=ascii";
        const response= await axios.get(url)
        //CHECK DATA INTEGRITY
        const data:string=response.data
        if(data.includes("Sorry, no data available")) throw new Error("Sorry, no data available")
    
        return data
    
    }  
    
}
