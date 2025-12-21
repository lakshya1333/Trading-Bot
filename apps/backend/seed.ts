import 'dotenv/config'
import mongoose from 'mongoose'
import { NodesModel } from 'db/client'

mongoose.connect(process.env.MONGO_URL!)

const nodes = [
  {
    name: "price-trigger",
    title: "Price Trigger",
    description: "Trigger workflow when asset price reaches a target",
    type: "TRIGGER",
    credentialsType: []
  },
  {
    name: "timer",
    title: "Timer",
    description: "Trigger workflow at regular time intervals",
    type: "TRIGGER",
    credentialsType: []
  },
  {
    name: "hyperliquid",
    title: "Hyperliquid Exchange",
    description: "Place trades on Hyperliquid exchange",
    type: "ACTION",
    credentialsType: [
      {
        title: "API_KEY",
        required: true
      }
    ]
  },
  {
    name: "lighter",
    title: "Lighter Exchange",
    description: "Place trades on Lighter exchange",
    type: "ACTION",
    credentialsType: [
      {
        title: "API_KEY",
        required: true
      }
    ]
  },
  {
    name: "backpack",
    title: "Backpack Exchange",
    description: "Place trades on Backpack exchange",
    type: "ACTION",
    credentialsType: [
      {
        title: "API_KEY",
        required: true
      }
    ]
  }
]

async function seedNodes() {
  try {
    // Clear existing nodes
    await NodesModel.deleteMany({})
    console.log('Cleared existing nodes')

    // Insert new nodes
    const result = await NodesModel.insertMany(nodes)
    console.log(`Successfully seeded ${result.length} nodes:`)
    result.forEach(node => {
      console.log(`  - ${node.name} (${node._id})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error seeding nodes:', error)
    process.exit(1)
  }
}

seedNodes()
