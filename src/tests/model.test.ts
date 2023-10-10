import { spawnSync, spawnHello, executeRModel } from "../model/spawnUtils/spawnUtils"



test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await executeRModel()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})