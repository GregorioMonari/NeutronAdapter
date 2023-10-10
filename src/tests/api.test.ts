import NmDbClient from "../client/NmdbClient";
import FinAppClient from "../client/FinAppClient";

test("NmDbClient call", async ()=>{
    const client= new NmDbClient();
    const res= await client.getJungDataOfToday();
    expect(res.Datetime.length).not.toBe(0)
    expect(res.Datetime.length).toBeLessThan(24)
})