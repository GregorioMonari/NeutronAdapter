import { spawn } from "child_process";

export interface SpawnOutput{
    out:string;
    err:string;
}


export function spawnSync(command:string,args:string[],working_dir:string):Promise<SpawnOutput>{
    let out=""
    let errOut=""
    return new Promise((resolve,reject)=>{

        //const command="Rscript";
        //const scriptPath="./src/examples/hello.R";
        const child= spawn(command,args,{cwd:working_dir});
        child.stdout.on('data', (data) => {
            //console.log(`R Output: ${data}`);
            out=out+data
        });
          
        child.stderr.on('data', (data) => {
            //console.error(`R Error: ${data}`);
            //reject(data);
            errOut=errOut+data
        });
    
        child.on("exit",()=>{
            resolve({"out":out,"err":errOut});
        })

    })
}

//--------TEST---------
export async function spawnHello(){
    const command="Rscript";
    const scriptPath="hello.R";
    const working_dir="./src/model";
    const response= await spawnSync(command,[scriptPath,"test_1"],working_dir)
    return response
}