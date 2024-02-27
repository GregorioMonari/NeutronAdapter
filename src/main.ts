//Import libraries
console.clear();
const jsap=require("../resources/neutron.adapter.jsap.json")
import NeutronAdapter from "./app/NeutronAdapter";
const log= require("greglogs").default; 
log.setLogLevel(2); //per più info metti a 0

//Start application
console.log("### Neutron Adapter ###")
const adapter= new NeutronAdapter(jsap);
adapter.start() //faccio partire l'adapter
 