import { spawn } from "child_process";



export default async function runRModel(jungData:any,finappData:any){
    
    const baseFileName="test"
    //TODO 1: scrivere jung data e finappData in baseFileName.in1.csv e baseFileName.in2.csv


    //TODO 2: spawn model
    //spawnSync()

    //TODO 3: leggi output da baseFileName.out.csv


    return 1.6
}





export async function spawnHello(){
    const command="Rscript";
    const scriptPath="./src/model/hello.R";
    const response= await spawnSync(command,[scriptPath,"test_1"])
    return response
}


export function spawnSync(command:string,args:string[]){
    return new Promise((resolve,reject)=>{

        //const command="Rscript";
        //const scriptPath="./src/examples/hello.R";
        const child= spawn(command,args);
        child.stdout.on('data', (data) => {
            console.log(`R Output: ${data}`);
        });
          
        child.stderr.on('data', (data) => {
            console.error(`R Error: ${data}`);
            reject(data);
        });
    
        child.on("exit",()=>{
            resolve("exited!");
        })

    })
}