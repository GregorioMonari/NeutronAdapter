export default class CommandLineParser {

    private orderedArgumentsMap:any;
    private notOrderedArgumentsMap:any;

    constructor(map:any){
        this.orderedArgumentsMap={}
        this.notOrderedArgumentsMap={}
        //Divide map of arguments into fixed position arguments and not.
        Object.keys(map).forEach(k=>{
            const argInfo:any= map[k];
            if(argInfo.hasOwnProperty("isOrdered")){
                if(argInfo["isOrdered"]==true){
                    this.orderedArgumentsMap[k]=argInfo
                }else{
                    this.notOrderedArgumentsMap[k]=argInfo
                }
            }else{
                this.notOrderedArgumentsMap[k]=argInfo
            }
        })
    }


    public parse(){
        var args=this.formatArguments()

        //Initialize the parsed arguments structure
        let parsedArgs:{
            [key:string]: string|null|boolean;
        }={}
        Object.keys(this.orderedArgumentsMap).forEach(k=>{
            parsedArgs[k]=null;
        })
        Object.keys(this.notOrderedArgumentsMap).forEach(k=>{
            parsedArgs[k]=null;
        })

        //Use the map to parse arguments
        for(var i=0; i<args.length; i++){

            if(i<Object.keys(this.orderedArgumentsMap).length){

                //todo

            }else{
                Object.keys(this.notOrderedArgumentsMap).forEach(k=>{
                    if(args[i]==this.notOrderedArgumentsMap[k].argName){
                        let isFlag=false
                        if(this.notOrderedArgumentsMap[k].hasOwnProperty("isFlag")){
                            if(this.notOrderedArgumentsMap[k].isFlag==true){
                                isFlag=true;
                            }
                        }
                        if(isFlag){
                            parsedArgs[k]=true
                        }else{
                            parsedArgs[k]=args[i+1];
                            i++
                        }
                    }
                })
            }
            
        }

        return parsedArgs
    }


    private formatArguments(){
        let args= process.argv.slice(2).map(value=>{
            let newValue= value.trim();
            if(newValue.startsWith("\'") || newValue.startsWith("\"")){
                newValue=newValue.slice(1);
            }
            if(newValue.endsWith("\'") || newValue.endsWith("\"")){
                newValue=newValue.slice(0,newValue.length-1);
            }
            return newValue
        })
        return args
    }
}