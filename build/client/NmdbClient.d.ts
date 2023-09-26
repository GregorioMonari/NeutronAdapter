export default class NmDbClient {
    constructor();
    /**
     * Get today's data from JUNG station
     * @returns
     */
    getJungDataOfToday(): Promise<any>;
    /**
     * Returns parsed data from JUNG station
     * @param startDate
     * @param stopDate
     * @returns
     */
    getJungData(startDate: string, stopDate: string): Promise<any>;
    private cleanRawData;
    private getRawData;
}
