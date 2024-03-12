import CommandLineParser from "./CommandLineParser"

export default class NeutronAdapterCommandLineParser extends CommandLineParser{
    constructor(){
        super({
            jsapPath: {
                argName: "-jsap"
            },
            host:{
                argName: "-host"
            },
            tls:{
                argName: "-tls"
            },
            http_port:{
                http_port: "-http_port"
            },
            ws_port:{
                ws_port: "-ws_port"
            },
            update_time:{
                updateTime: "-update_time"
            }
        });
    }
}