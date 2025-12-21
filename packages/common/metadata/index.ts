export const SUPPORTED_ASSETS = ["SOL","BTC","ETH"]

export const SUPPORTED_ACTIONS = [
    { id: "hyperliquid", title: "Hyperliquid Exchange" },
    { id: "lighter", title: "Lighter Exchange" },
    { id: "backpack", title: "Backpack Exchange" }
]

export type TradingMetadata = {
    actionType: string,
    type: "long" | "short",
    qty: number,
    symbol: string,
    apiKey: string
}

export type TimerNodeMetadata = {
    time: number
}


export type PriceTriggerMetadata = {
    asset: string,
    price: number
}