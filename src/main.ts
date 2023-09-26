import NmDbClient from "./client/NmdbClient";


main();

async function main() {

    const client= new NmDbClient();
    const data= await client.getJungDataOfToday()
    console.log(data)
}




/*
main()

async function main(){

    console.time("Csv read in")
    const filePath='C:/Users/fravi/Documents/GitHub/NeutronAdapter/id_sensor_baroni.csv';
    const csv= await read_csv_from_path(filePath,",")
    console.timeEnd("Csv read in")
    //console.log(csv["id_finapp"][0])
    console.log("starting program")
    
    const data= await getRawFinappData(csv["id_finapp"][1])
    //console.log(data)
    const csvData= await read_csv_from_string(data,";");
    console.log(csvData)
    //console.log("Received "+(data.length/1000)+" Kilobytes")
    console.log("finished program")
    
    
}

async function getRawFinappData(id_finapp:number){
    //console.log("Values before get request:",idFinappValues)
    //const id_finapp= idFinappValues[1];
    const id_finapp_detector= 1;

    const finappUrl="https://www.finapptech.com/finapp/api/getCSV_id.php?ID="+id_finapp+"=&D="+id_finapp_detector;
    //console.log(finappUrl)
    const response= await axios.get(finappUrl)

    const data= response.data
    return data
} 
*/

//FUNCTION IMPLEMENTED WITH THE REPRESENTATION OF FIRST DATA COLLECTED BY THE SENSOR
/*
async function main() {
    console.log("Starting program");
    const data = await getRawFinappData();
    const firstDate = findFirstDate(data);
    console.log("First date of recording:", firstDate);
    console.log("Received " + (data.length / 1000) + " Kilobytes");
    console.log("Finished program");
}

async function getRawFinappData() {
    const id_finapp = 67;
    const id_finapp_detector = 1;
    const FinappUrl = "https://www.finapptech.com/finapp/api/getCSV_id.php?ID=" + id_finapp + "=&D=" + id_finapp_detector;
    const response = await axios.get(FinappUrl);
    const data = response.data;
    return data;
}

function findFirstDate(csvData: string) {
    const lines = csvData.trim().split('\n'); // Split data into lines
    if (lines.length > 1) {
        // Assuming the date is in the first column of the second row (after skipping the header)
        const columns = lines[1].split(',');
        const dateStr = columns[0].trim();
        return dateStr;
    } else {
        return "No data found";
    }
}

main();
*/



