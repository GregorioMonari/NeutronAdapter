import { spawnSync, spawnHello } from "../model/spawnUtils/spawnUtils"



test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await spawnHello()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})