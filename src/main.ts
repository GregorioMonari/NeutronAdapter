import * as fs from 'fs';
const log= require("greglogs").default; 
log.setLogLevel(2); //set to 0 for more info
import NeutronAdapterCommandLineParser from "./utils/NeutronAdapterCommandLineParser";
import NeutronAdapter from "./app/NeutronAdapter"; //main class


// Start the application
console.log("#######################")
console.log("### Neutron Adapter ###")
console.log("#######################")
const jsap= getConfiguredJsap()
const adapter= new NeutronAdapter(jsap);
adapter.start(); //faccio partire l'adapter
 

// Configure jsap using command line arguments or environment variables
function getConfiguredJsap(){
    // get cmd args
    const cmdParser= new NeutronAdapterCommandLineParser();
    const argsMap= cmdParser.parse();
    // get jsap
    const jsapPath= argsMap.jsapPath? argsMap.jsapPath : 
        process.env["jsap"]? process.env["jsap"] : "./resources/neutron.adapter.jsap.json";
    const jsapFile= fs.readFileSync(jsapPath as string).toString();
    const jsap= JSON.parse(jsapFile);
    console.log("- Using jsap:",jsapPath)
    // override parameters
    jsap.host= argsMap.host? argsMap.host :
        process.env["host"]? process.env["host"] : jsap.host;
    console.log("- host:",jsap.host)
    const tlsEnabled= argsMap.tls? argsMap.tls :
        process.env["tls"]? process.env["tls"] : false; //disabled by default
    if(tlsEnabled){
        jsap.sparql11protocol.protocol= "https";
        jsap.sparql11seprotocol.protocol= "wss";
    }else{
        jsap.sparql11protocol.protocol= "http";
        jsap.sparql11seprotocol.protocol= "ws";  
    }
    // http port
    jsap.sparql11protocol.port= argsMap.http_port? argsMap.http_port :
        process.env["http_port"]? process.env["http_port"] : jsap.sparql11protocol.port;
    console.log("- http port:",jsap.sparql11protocol.port)
    // websocket port
    const currWsProtocol= jsap.sparql11seprotocol.protocol;
    jsap.sparql11seprotocol.availableProtocols[currWsProtocol].port= argsMap.ws_port? argsMap.ws_port :
        process.env["ws_port"]? process.env["ws_port"] : jsap.sparql11seprotocol.availableProtocols[currWsProtocol].port;
    console.log("- ws port:",jsap.sparql11seprotocol.availableProtocols[currWsProtocol].port)
    console.log("- tls:",tlsEnabled)
    return jsap;
}
