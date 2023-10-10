import { spawnSync, spawnHello, executeRModel } from "../model/spawnUtils/spawnUtils"
import { spawn } from "child_process";

test("spawnHello",async ()=>{
    const response=await spawnHello();
    console.log(response)
    expect(response).not.toBe("")
})


test("spawnModel",async ()=>{
    const response= await executeRModel()
    console.log(response)
})

/*
test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await spawnHello()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})
*/