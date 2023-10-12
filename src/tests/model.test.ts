import { runModel } from "../model/spawnUtils/neutronCount2SoilMoisture"
import { spawnHello } from "../model/spawnUtils/core";
import NmDbClient from "../client/NmdbClient";
import FinAppClient from "../client/FinAppClient";
import neutronCount2SoilMoisture from "../model/spawnUtils/neutronCount2SoilMoisture";

test("spawnHello",async ()=>{
    const response=await spawnHello();
    console.log(response)
    expect(response).not.toBe("")
})


test("spawnModel",async ()=>{
    const response= await runModel("testData/test_2")
    console.log(response)
},60000)


test("feed data from api",async ()=>{
    const jclient= new NmDbClient();
    const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");  
    console.log("** FETCHING DATA FROM API")
    const jungData= await jclient.getRawData("JUNG","2023-06-10","2023-10-12");
    console.log("Received",jungData.length,"Bytes from Jung")
    const finappData= await fclient.getRawFinappData(67); 
    console.log("Received",finappData.length,"Bytes from Finapp")
    const modelOutput= await neutronCount2SoilMoisture(jungData,finappData) //TODO: leggi e scrivi su file
    console.log("Output:",modelOutput.length)
},60000)

/*
test("Spawn generic R script",async ()=>{

    console.time("R execution time")
    const result=await spawnHello()
    console.timeEnd("R execution time")
    expect(result).toBe("exited!")

})
*/