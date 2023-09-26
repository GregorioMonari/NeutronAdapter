export interface FinAppData {
    "#Datetime": string[];
    neutrons: string[];
    muons: string[];
    gamma: string[];
    "integration_time(s)": string[];
    "V_in(volt)": string[];
    "temperature_in(°C)": string[];
    "temperature_ext(°C)": string[];
    "ur(%)": string[];
    "pressure(hPa)": string[];
}
export default class FinAppClient {
    private excelPath;
    constructor(_excelPath: string);
    getFinappData(excelRowNumber: number): Promise<FinAppData>;
    getRawFinappData(id_finapp: number): Promise<string>;
}
