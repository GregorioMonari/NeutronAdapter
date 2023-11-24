import FinAppClient from "./client/FinAppClient";
import { FinAppData } from "./client/FinAppClient";
import NmDbClient from "./client/NmdbClient";
import { JungData } from "./client/NmdbClient";
import { spawn } from "child_process";
import { EventEmitter } from "stream";

import {runModel } from "./model/spawnUtils/neutronCount2SoilMoisture";
import neutronCount2SoilMoisture from "./model/spawnUtils/neutronCount2SoilMoisture";
import { read_csv_from_string } from "./utils/CsvParser";
import { DateTime } from "luxon";
import { CronJob } from "cron";
import { calculateSMYesterday } from "./model/spawnUtils/neutronCount2SoilMoisture";

import { Producer,Consumer } from "pacfactory";
//const jsap= require("../resources/play.jsap.json");
const jsap=require("../resources/criteria.jsap.json")
import PlantsConsumer from "./pac/consumers/PlantsConsumer";
import GraphCleaner from "./pac/producers/GraphCleaner";
import WeedsConsumer from "./pac/consumers/WeedsConsumer";
import WeedsGraphCleaner from "./pac/producers/WeedsGraphCleaner";
import AlarmConsumer from "./pac/consumers/AlarmConsumer";
import SensorConsumer from "./pac/consumers/SensorConsumer";
import SensorGraphCleaner from "./pac/producers/SensorGraphCleaner";
const log= require("greglogs").default; 
log.setLogLevel(4); //per più info metti a 0

//console.log(jsap)
/**
//TODO
1. creare una coppia di query-update, ovvero:
    - NOTA: deve avere un parametro numerico tipo AvailableWater
    - scrivere il testo della query e update (testarlo sulla dashboard se necessario)
    - copia la query e l'update nel jsap e dagli un nome
    - leva le costanti e aggiungi forced bindings
2. Creare un produttore e consumatore per poter operare con queste query da js
    - usa quello base, tipo const consumer= new Consumer(jsap,"queryName",{})
3. Crea un piccolo programma che usa questi moduli pac
    - ripulisci grafico
    - fammi 3-4 update con piante diverse
    - fai la query e stampami i risultati
4. Aggiungi subscription
    - iscriviti alle piante
    - quando ricevi una nuova notifica (on added results):
        - checka se l'available water è sotto un valore di soglia che inventi tu
        - if(availableWater<soglia)
            - fai un update al sepa mandando un allarme! (_:b rdf:type agri:Alarm)
    - ora che ti sei iscritto, manda l'update con una nuova pianta e available water deciso da te
 
# QUINDI ALLA FINE USIAMO I SEGUENTI MODULI PAC
- PlantsConsumer
- PlantsProducer -> è quello che fa partire la sub
- Alarm Producer


#CHE METODI CI INTERESSANO
await producer.updateSepa({...})
await consumer.querySepa({})
consumer.on("addedResults",()=>{ 
    ...
})
consumer.subscribeToSepa()
 
    */


//TODO: PRODUCER CON I DATI DEL MODELLO
/*
1. Creare producer e consumer partendo dal nuovo jsap
    - consumer: GET_SENSOR_DATA
    - producer: uploadCriteriaSensorData
    - producer (cleaner): cleanSensorData

    sensorDataProducer.updateSepa({
        date: "2021-10-15T03:03:00Z",
        ...
        value: "30"
    })

2. Prova a produrre e consumare un dato fake impostato da te
    STEPS
    # Subscription
    - clean
    - subscribe (definire onAddedResults + subscribeToSepa)
    - produce
    # Query
    - clean
    - produce
    - query

3. Al posto del dato fake del produttore mettici l'output del modello

    const SMmean = await calculateSMYesterday(csvOut);

    sensorDataProducer.updateSepa({
        date: "2021-10-15T03:03:00Z",
        ...
        value: SMean
    })
 */


/*main2()

async function main2(){
    const sensorConsumer = new SensorConsumer(jsap);
    const sensorGraphCleaner = new SensorGraphCleaner(jsap);
    const sensorProducer = new Producer(jsap,"uploadCriteriaSensorData")
    

    await sensorGraphCleaner.cleanSensorData();

    sensorProducer.updateSepa({
        date:"2021-10-15T03:03:00Z", 
        value: "38.5",
        portNumber:  "1",
        layerNumber: "15",
        sensorId:"2183891ui"
    })
    


    await wait(1000)

    let queryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
    console.log("QueryResult:",queryResult) 

    sensorConsumer.on("firstResults",(not:any)=>{
        //console.log(not)
    })
    sensorConsumer.on("addedResults",(not:any)=>{
        const bindings=not.getBindings()
        console.log("Umidità media giornaliera di ieri:",bindings)
    })
    sensorConsumer.on("removedResults",(not:any)=>{
        //console.log(not)
    })
    
    sensorConsumer.subscribeToSepa()

    await sensorProducer.updateSepa({
        date:"2021-10-15T03:03:00Z", 
        value: ,
        portNumber:  "1",
        layerNumber: "15",
        sensorId:"2183891ui"

    })
    
}




async function wait(ms:number){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

*/








/*
main()
async function main(){ 







    const plantsConsumer = new PlantsConsumer(jsap);
    const graphCleaner = new GraphCleaner(jsap);
    const plantsProducer = new Producer(jsap,"addPlant")
    //plantsConsumer.log.logLevel=3;

    //PULISCI GRAFO 
    await graphCleaner.cleanPlants();

    //QUERY (dovrebbe essere vuota)
    console.log("Graph cleaned")
    let queryResult= await plantsConsumer.querySepa();
    console.log("QueryResult:",queryResult)  


    plantsConsumer.on("firstResults",(not:any)=>{
        //console.log(not)
    })
    plantsConsumer.on("addedResults",(not:any)=>{
        const bindings=not.getBindings()
        console.log("Ho aggiunto una pianta!:",bindings)
    })
    plantsConsumer.on("removedResults",(not:any)=>{
        //console.log(not)
    })
    
    plantsConsumer.subscribeToSepa()


    await wait(1000);

    //UPDATE
    const plants=["Potato","Tomato","Strawberry"]
    const colors=["Yellow","Red","Red"]
    for(var i=0;i<plants.length;i++){
        console.log("Sto inserendo:",plants[i])
        await plantsProducer.updateSepa({
            plantName:plants[i],
            plantColor:colors[i]
        });
        await wait(1000);
    }


    //queryResult= await plantsConsumer.querySepa();
    //console.log("QueryResult:",queryResult) 

}



*/


/*
interface Plant{
    s:string;
    varietyName:string;
    s2:string;
    thcLevel:string;
    effect:string;
}

function onNewWeed(plant:Plant){
    console.log("Ho aggiunto una pianta!:",plant)
    const thcLevel= parseFloat(plant.thcLevel);
    const alarmProducer = new Producer (jsap,"sendAlarm")

    if (thcLevel<20){
        const text= "Not good, block the production, we need more."
        console.log("Sending alarm:",text)
        alarmProducer.updateSepa({
            text:text
        })   
    }else{
        if(thcLevel>40){
            const text="This weed is fire"
            console.log("Sending alarm:",text)
            alarmProducer.updateSepa({
                text:text
            })
        }
    }

     //console.log("thc %: " + plant.thcLevel)
}
*/



/*
const array=["greg","francesco","marco"]

//MODO 1
for(var i=0;i<array.length;i++){
    const element=array[i]

    console.log("Curr index: "+i+", curr value: "+element)
}

//MODO 2
for(const element of array){
    console.log("Curr value: "+element)
}
*/

/*
main()
async function main(){ 

    const weedsConsumer = new WeedsConsumer(jsap);
    const graphCleaner = new WeedsGraphCleaner(jsap);
    const weedsProducer = new Producer(jsap,"addWeedVariety")
    const multipleWeedsProducer = new Producer(jsap,"exampleMultipleAddWeedVariety")
    const alarmConsumer = new AlarmConsumer(jsap);
    
    //plantsConsumer.log.logLevel=3;
 
    //PULISCI GRAFO 
    await graphCleaner.cleanWeeds();

    alarmConsumer.on("firstResults",(not:any)=>{
        //console.log(not)
    })
    alarmConsumer.on("addedResults",(not:any)=>{
        const bindings=not.getBindings()
        //console.log("[CONSUMER] Ho ricevuto una notifica! (" + bindings.length + " elements)",)
        for(const element of bindings){
            console.log(element.text)
        }
    }) 
    alarmConsumer.subscribeToSepa()
   
    //QUERY (dovrebbe essere vuota)
    console.log("Graph cleaned")
    let queryResult= await weedsConsumer.querySepa();
    console.log("QueryResult:",queryResult)  

    
    
    weedsConsumer.on("firstResults",(not:any)=>{
        //console.log(not)
    })
    weedsConsumer.on("addedResults",(not:any)=>{
        const bindings=not.getBindings()
        //console.log("[CONSUMER] Ho ricevuto una notifica! (" + bindings.length + " elements)",)
        for(const element of bindings){
            onNewWeed(element)
        }
    })
    weedsConsumer.on("removedResults",(not:any)=>{
        //console.log(not)
    })

    weedsConsumer.subscribeToSepa()
    

    await wait(2000);

    //UPDATE
    const weeds=["Amnesia","Blueberry","BigBuddaCheese"]
    const thc=["23","20","18"]
    const effect=["sativa","indica","halfAndHalf"]
    for(var i=0;i<weeds.length;i++){
        //console.log("[PRODUCER] Sto inserendo:",weeds[i])
        await weedsProducer.updateSepa({
            weedName:weeds[i],
            thcLevel:thc[i],
            weedEffect:effect[i]
        }); 
        
        await wait(1000);
    }
    //console.log("Sto inserendo diverse piante")
    await multipleWeedsProducer.updateSepa({})
    
    
 
    //queryResult= await weedsConsumer.querySepa();
    //console.log("QueryResult:",queryResult) 

    }



    async function wait(ms:number){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
    }


*/








//CRON---------------------------------------------------------------------------------------
/*
TODO: 
1- metti media del soil moisture nella funzione getSoilMOistureMean
2- scrivere il tipo dell'ouput del modello
3- converti da unitTime a cronPattern
4- stampa il valore del sensor id+orario corrente da DENTRO il cron job

*/


const cronPatterns={
    "every5seconds":"*/5 * * * * *",
    "every10seconds":"*/10 * * * * *",
    "everyDayAt-currTimeZone":"25 14 * * *",
    "everyDayAt-UTC":"56 13 * * *",
}
/*

function task(){
    const date= new Date()
    console.log("Cron job started at",date.toISOString())
}

*/


/*
async function main(){
    console.log("MAIN STARTED")
}
*/

/*
async function main(){
    console.log("MAIN STARTED")

    const unitTime="14:00" 
    const sensorId="JUNG.67"
    // Extract the hours and minutes from unitTime
    const [hours, minutes] = unitTime.split(':');

    // Create the cron pattern for running at 11:30 AM in your current time zone
    const cronPattern = `0 ${minutes} ${hours} * * *`;

    const job = new CronJob(cronPattern, ()=>{
        console.log(sensorId)
    }, null, false, "Europe/Rome");
    job.start()

}

*/
main()



async function main(){
    const jclient= new NmDbClient();
    const fclient= new FinAppClient("../resources/id_sensor_baroni.csv");
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    console.log("** FETCHING DATA FROM API")
    //TODO: CHE DATA METTO IN JUNG?
    const jungData= await jclient.getRawData("JUNG","2023-04-01",isoDate);
    console.log("Received",jungData.length,"Bytes from Jung") 
    const finappData= await fclient.getRawFinappData(67); 
    console.log("Received",finappData.length,"Bytes from Finapp")

    
    const csvOut= await neutronCount2SoilMoisture(jungData,finappData)
    //console.log("Output:",modelOutput.length)


    const SMmean = await calculateSMYesterday(csvOut);

    console.log("Soil Moisture Mean of the Previous Day: " + SMmean); 

        const sensorConsumer = new SensorConsumer(jsap);
        const sensorGraphCleaner = new SensorGraphCleaner(jsap);
        const sensorProducer = new Producer(jsap,"uploadCriteriaSensorData")
        

        await sensorGraphCleaner.cleanSensorData();

        /*sensorProducer.updateSepa({
            date:"2021-10-15T03:03:00Z", 
            value: "38.5",
            portNumber:  "1",
            layerNumber: "15",
            sensorId:"2183891ui"
        })
        */


        await wait(1000)

        let queryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
        console.log("QueryResult:",queryResult) 

        sensorConsumer.on("firstResults",(not:any)=>{
            //console.log(not)
        })
        sensorConsumer.on("addedResults",(not:any)=>{
            const bindings=not.getBindings()
            console.log("Umidità media giornaliera di ieri:",bindings)
        })
        sensorConsumer.on("removedResults",(not:any)=>{
            //console.log(not)
        })
        
        sensorConsumer.subscribeToSepa()

        await wait(2000)

        await sensorProducer.updateSepa({
            date:"2021-10-15T03:03:00Z", 
            value: SMmean,
            portNumber:  "1",
            layerNumber: "15",
            sensorId:"2183891ui"

        })
        
        await wait(2000)
        let realQueryResult= await sensorConsumer.querySepa(); //lo useremo per testare l'app
        console.log("QueryResult:",queryResult) 
    }











    async function wait(ms:number){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    }
    // Access the CSV data property from the object
