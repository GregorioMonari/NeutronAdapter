export interface JungData {
    Datetime: string[];
    RCORR_E: string[];
}
export default class NmDbClient {
    constructor();
    /**
     * Get today's data from JUNG station
     * @returns
     */
    getJungDataOfToday(): Promise<JungData>;
    /**
     * Returns parsed data from JUNG station
     * @param startDate
     * @param stopDate
     * @returns
     */
    getJungData(startDate: string, stopDate: string): Promise<JungData>;
    private cleanRawData;
    /**
     * Get raw api data in string form from nmdb.
     * Allowed stations: JUNG, JUNG1
     * @param station
     * @param startDate
     * @param stopDate
     * @returns
     */
    getRawData(station: string, startDate: string, stopDate: string): Promise<string>;
}
