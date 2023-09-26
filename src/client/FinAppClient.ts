import axios from 'axios'
import { read_csv_from_path, read_csv_from_string } from '../utils/CsvParser';

export interface FinAppData{
    "#Datetime":string[];
    neutrons:string[];
    muons:string[];
    gamma:string[];
    "integration_time(s)":string[];
    "V_in(volt)":string[];
    "temperature_in(°C)":string[];
    "temperature_ext(°C)":string[];
    "ur(%)":string[];
    "pressure(hPa)":string[];
}

export default class FinAppClient{

    private excelPath:string;

    constructor(_excelPath:string){
        this.excelPath= _excelPath;
    }

    async getFinappData(excelRowNumber:number):Promise<FinAppData>{

        //1. READ EXCEL
        //const filePath='C:/Users/fravi/Documents/GitHub/NeutronAdapter/resources/id_sensor_baroni.csv';
        const excel= await read_csv_from_path(this.excelPath,",")

        //2. Extract sensor id
        const id_finapp=excel["id_finapp"][excelRowNumber]

        //3. Get data from api with id_finapp as parameter
        const rawData= await this.getRawFinappData(id_finapp)

        //4. Parse string to json
        const csvData= await read_csv_from_string(rawData,";");

        return csvData
    }
    
    

    async getRawFinappData(id_finapp:number):Promise<string>{
        //console.log("Values before get request:",idFinappValues)
        //const id_finapp= idFinappValues[1];
        const id_finapp_detector= 1;
    
        const finappUrl="https://www.finapptech.com/finapp/api/getCSV_id.php?ID="+id_finapp+"=&D="+id_finapp_detector;
        //console.log(finappUrl)
        const response= await axios.get(finappUrl)
    
        const data= response.data
        return data
    } 
}