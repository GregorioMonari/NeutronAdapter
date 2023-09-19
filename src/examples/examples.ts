export const chiave_api= "xjadihasodjasi"

export default function print_examples(){
    //* ESEMPI UTILI
    console.log("# ESEMPI UTILI #")

    var nonDefinito:undefined= undefined;
    var nonDefinito2;
    var nullo:null= null;
    var numero:number= 10;
    var carattere:string= "c";
    var stringa:string= "ciao";

    var array:number[]=[10,15,0,-1]
    var stringArray:string[] =["ciao","come","stai"]
    var mixedArray:(string|number)[] =["ciao",10]



    console.log("Stringa: " + stringa) //concatenazione di stringhe
    console.log("Stringa:",stringa) //concatenazione di stringhe ma con operatore ','
    console.log("Array: ",stringArray) //concatenazione di stringa e struttura complessa, funziona solo dentro console.log
}