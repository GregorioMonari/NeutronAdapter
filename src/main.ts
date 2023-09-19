import print_examples from './examples/examples'

import axios from 'axios'






axios.get("https://www.google.")
    .then((res)=>{
        console.log(res.data)
    })
    .catch((e)=>{
        console.log("E' ARRIVATO UN ERRORE! PROBABILMENTE HAI SBAGLIATO L'URL")
    })
    .finally(()=>{
        console.log("Ho concluso la richiesta. Potrebbe essere andata bene o male.")
    })


console.log("CIAO")






 


