"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default.get("https://www.google.")
    .then((res) => {
    console.log(res.data);
})
    .catch((e) => {
    console.log("E' ARRIVATO UN ERRORE! PROBABILMENTE HAI SBAGLIATO L'URL");
})
    .finally(() => {
    console.log("Ho concluso la richiesta. Potrebbe essere andata bene o male.");
});
console.log("CIAO");
