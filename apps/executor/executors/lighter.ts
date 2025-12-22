
export async function execute(asset: "SOL" | "BTC" | "ETH", qty: number,type: "LONG" | "SHORT",API_KEY: string){
    // logic for placing the trade
    console.log("Executing trade on lighter")
    console.log(`${asset},${qty},${type},${API_KEY}`)
}