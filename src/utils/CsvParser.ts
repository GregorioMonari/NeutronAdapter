import * as fs from 'fs'
import csv from 'csv-parser'

export async function read_csv_from_path(filePath:string,separator:string):Promise<any>{
    //const filePath = 'C:/Users/fravi/Documents/GitHub/NeutronAdapter/id_sensor_baroni.csv'; 
    //const idFinappValues: string[] = [];
    
    return new Promise((resolve,reject)=>{
        var container:any=null;
        var isFirstRow=true;
        
        fs.createReadStream(filePath)
        .pipe(csv({
            separator: separator
        }))
        .on('data', (row) => {
            //console.log(row)
            if(isFirstRow){
                isFirstRow=false;
                //console.log("Prima riga:",row)
        
                container=row;
        
                Object.keys(row).forEach((colName)=>{
                    //console.log(colName)
                    const firstValue=row[colName]
                    container[colName]=[firstValue]
                })
        
            }else{
                //console.log("Altra riga:",row)
                Object.keys(row).forEach((colName)=>{
                    //console.log(colName)
                    const value=row[colName]
                    container[colName].push(value)
                })
            }
            //const idFinappValue = row['id_finapp'];
            //if (idFinappValue) {
            //  idFinappValues.push(idFinappValue);
            //}
        })
        .on('end', () => {
            //console.log("FINISHED READING CSV")
            //console.log('id_finapp values:', idFinappValues);
            //console.log(container)
            resolve(container)
        })
        .on('error', (error) => {
            console.error('Error reading the CSV file:', error);
            reject(error)
        });
    });
}

export async function read_csv_from_string(csvString: string,separator:string): Promise<any> {
  return new Promise((resolve, reject) => {
    let container: any = null;
    let isFirstRow = true;

    var parser= csv({
        separator: separator
    });
    parser
        .on('data', (row) => {
            //console.log(row)
            if(isFirstRow){
                isFirstRow=false;
                //console.log("Prima riga:",row)
        
                container=row;
        
                Object.keys(row).forEach((colName)=>{
                    //console.log(colName)
                    const firstValue=row[colName]
                    container[colName]=[firstValue]
                })
        
            }else{
                //console.log("Altra riga:",row)
                Object.keys(row).forEach((colName)=>{
                    //console.log(colName)
                    const value=row[colName]
                    container[colName].push(value)
                })
            }
            //const idFinappValue = row['id_finapp'];
            //if (idFinappValue) {
            //  idFinappValues.push(idFinappValue);
            //}
        })
        .on('end', () => {
            //console.log("FINISHED READING CSV")
            //console.log('id_finapp values:', idFinappValues);
            //console.log(container)
            resolve(container)
        })
        .on('error', (error) => {
            console.error('Error reading the CSV file:', error);
            reject(error)
        });

    parser.write(csvString);
    parser.end();
  });
}