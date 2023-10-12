import { spawnSync } from './core';
import * as fs from 'fs';

/*
FLOW
Flusso di runRModel
1. chiamo api jung e finapp, in uscita voglio i dati RAW (no json)
2. chiamo runRModel con come argomento i dati RAW
3. in uscita prendo la stringa csv

COSA SUCCEDE DENTRO RUNRMODEL
1. Prendo gli argomenti jungData e finappData e li scrivo nei file test.in1.csv e in2
2. chiamo executeModel, che legge da quei file e scrive nel file out
3. Leggo il file out e ritorno la stringa csv

*/

//!BUG: AL PRIMO AVVIO SE NON C'E' LA CARTELLA INIZIALE CRASHA
export default async function neutronCount2SoilMoisture(jungData:any,finappData:any){
    //TODO: settare nome file con la data
    let outStringData="";
    const date= new Date()
    const stringDate= date.toISOString()
    const baseFileName="dataIO/test_2"

    try{
        //*FEAT: scrivere jung data e finappData in baseFileName.in1.csv e baseFileName.in2.csv
        fs.writeFileSync("./src/model/"+baseFileName+".in1.csv",jungData);
        fs.writeFileSync("./src/model/"+baseFileName+".in2.csv",finappData);

        //*FEAT: spawn model
        console.log("---------<Starting R model>-----------")
        console.time("Model execution time")
        const consoleOutput= await runModel(baseFileName)
        console.log(">> R MODEL OUTPUT")
        console.log(consoleOutput.out)
        console.timeEnd("Model execution time")
        console.log(">> Errors")
        console.log(consoleOutput.err)
        console.log("---------<R model END>-----------")

        //*FEAT: leggi output da baseFileName.out.csv
        outStringData= fs.readFileSync("./src/model/"+baseFileName+".out.csv").toString();
    }catch(e){
        console.log("! ERROR DURING MODEL EXECUTION")
        console.log(e)
    }
    
    //TODO: REMOVE OLD FILES
    fs.unlinkSync("./src/model/"+baseFileName+".in1.csv")
    fs.unlinkSync("./src/model/"+baseFileName+".in2.csv")
    fs.unlinkSync("./src/model/"+baseFileName+".out.csv")
    return outStringData
}

export async function runModel(baseFilePath:string){
    const command="Rscript";
    const scriptPath="processing_imola_v0001.R";
    const working_dir="./src/model";
    const response= await spawnSync(command,[scriptPath,baseFilePath],working_dir)
    return response
}

