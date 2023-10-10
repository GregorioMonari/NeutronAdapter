import { spawn } from "child_process";
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



//TODO: CAMBIA SOLO QUESTA FUNZIONE
export default async function runRModel(jungData:any,finappData:any){
    
    const baseFileName="test"
    //TODO 1: scrivere jung data e finappData in baseFileName.in1.csv e baseFileName.in2.csv
    

    //TODO 2: spawn model
    await executeRModel()

    //TODO 3: leggi output da baseFileName.out.csv
    const outStringData= fs.readFileSync("./src/model/dataIO/test.out.csv");

    return outStringData.toString()
}



export async function executeRModel(){
    const command="Rscript";
    const scriptPath="processing_imola_v0001.R";
    const working_dir="./src/model";
    const response= await spawnSync(command,[scriptPath],working_dir)
    return response
}


//TEST
export async function spawnHello(){
    const command="Rscript";
    const scriptPath="hello.R";
    const working_dir="./src/model";
    const response= await spawnSync(command,[scriptPath,"test_1"],working_dir)
    return response
}
export function spawnSync(command:string,args:string[],working_dir:string){
    let out=""
    return new Promise((resolve,reject)=>{

        //const command="Rscript";
        //const scriptPath="./src/examples/hello.R";
        const child= spawn(command,args,{cwd:working_dir});
        child.stdout.on('data', (data) => {
            //console.log(`R Output: ${data}`);
            out=out+data
        });
          
        child.stderr.on('data', (data) => {
            console.error(`R Error: ${data}`);
            //reject(data);
        });
    
        child.on("exit",()=>{
            resolve(out);
        })

    })
}