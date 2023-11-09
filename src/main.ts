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
const jsap= require("../resources/play.jsap.json");
import PlantsConsumer from "./pac/consumers/PlantsConsumer";
import GraphCleaner from "./pac/producers/GraphCleaner";
import WeedsConsumer from "./pac/consumers/WeedsConsumer";
import WeedsGraphCleaner from "./pac/producers/WeedsGraphCleaner";
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


async function wait(ms:number){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
*/




main()
async function main(){ 

    const weedsConsumer = new WeedsConsumer(jsap);
    const graphCleaner = new WeedsGraphCleaner(jsap);
    const weedsProducer = new Producer(jsap,"addWeedVariety")
    //plantsConsumer.log.logLevel=3;

    //PULISCI GRAFO 
    await graphCleaner.cleanWeeds();

    //QUERY (dovrebbe essere vuota)
    console.log("Graph cleaned")
    let queryResult= await weedsConsumer.querySepa();
    console.log("QueryResult:",queryResult)  

    weedsConsumer.subscribeToSepa()

    weedsConsumer.on("firstResults",(not:any)=>{
        //console.log(not)
    })
    weedsConsumer.on("addedResults",(not:any)=>{
        const bindings=not.getBindings()
        console.log("Ho aggiunto una pianta!:",bindings)
    })
    weedsConsumer.on("removedResults",(not:any)=>{
        //console.log(not)
    })

    


    await wait(5000);

    //UPDATE
    const weeds=["Amnesia","Blueberry","BigBuddaCheese"]
    const thc=["23","20","18"]
    const effect=["sativa","indica","halfAndHalf"]
    for(var i=0;i<weeds.length;i++){
        console.log("Sto inserendo:",weeds[i])
        await weedsProducer.updateSepa({
            weedName:weeds[i],
            thcLevel:thc[i],
            weedEffect:effect[i]
        }); 
        await wait(1000);
    }


    //queryResult= await plantsConsumer.querySepa();
    //console.log("QueryResult:",queryResult) 

    }



    async function wait(ms:number){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
    }











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

/*main()


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
}
    // Access the CSV data property from the object
*/