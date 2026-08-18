# The Basics of Flashbots and MEV

## Roles

- **Searchers** - The searchers are those that find the MEV (whether through arbitrage, liquidations, sandwiches, etc) and create the **bundles**which are ordered lists of transactions. These bundles very well can incorporate the searcher's own transactions along with transactions from the public mempool.

- **Builders** - Builders collect public mempool transactions and private bundles from searchers, optimizing ordering and building the most profitable blocks.

- **Relays** - The relays are the intermediaries between the builders and proposers, which validate blocks and enforce the "blinded" flow where proposers can't see the contents of the blocks before committing. 

- **Proposer** - Chosen randomly for a given slot. The proposer chooses the highest-paying bid and publishes the block. 


## Step-by-step Flow

1. When you submit a transaction to a node (typically through RPC endpoint), the node's **execution client** performs basic validity checks (enough ETH, correct signature), if valid, adds it to its **mempool** and propogates it through **execution layer transaction gossip** network.

2. **Searchers** send bundles to one or more **builders** (typically through private endpoints or auction infrastructure), sometimes with public mempool transactions. 

3. **Builders** construct the full block (**execution payload**) and attach a bid for the proposer, then submit it to **relays**, which then simulate and verify blocks before offering the best valid bid onward. 

4. **MEV-Boost** is the middleware that is run by the **validators** to access a competitive block-building market.

5. Each **relay** returns the **header** of its highest-bidding valid block (this is in the form of a cryptographic commitment to the contents of the block) 
6. The **proposer** picks the best bid and produces a **blinded beacon block** which contains only their signature and the execution payload header (importanty excluding the transaction list).

7. After the proposer commits (signs the header), the relay reveals the **full execution payload** so that the proposer can publish it to the network. The proposer also executes the transactions locally to verify state change.  

8. Other validators verify the block and broadcast **attestations**, which drive the fork choice. 

9. **Finality** happens at **epoch checkpoints** when there is a **supermajority link** (greater than or equal to 2/3) between checkpoints, which justifies the newer checkpoint and finalizes the older one.  

## The Problem that Flashbots solved 

- Prior to the solutions posed by Flashbots, the Ethereum network was suffering drastically from the negative externalities associated with searcher competing for MEV.
- One of the most impactful externalities was the way in which competing searchers would continuously raise **priority gas fees** to outbid the others. This, alongside extreme network congestion, had massive negative implications for the larger scale adoption of the Ethereum network. 
- There was also increasing centralization risk, as a result of validators being the "gatekeepers" of ordering.

## The Solutions

- **MEV explorers for more transparency**

- **MEV-Boost, Relays and Builder Market (PBS)**
     - PBS is **Proposer-Builder Separation**, which is the design idea that allows for the proposer and the builder to be two separate entities
     - The builder market is the economic system that PBS creates, which allows for an open market of builders to bid to get their block chosen by the proposer. 
     - MEV-Boost is software the proposer runs to access the builder market. It automatically queries the relays for the best bid.


## Issues Today

- Issues related to MEV today are along the lines of making the MEV supply chain safer, more neutral, and less centralized.
    1. Removing the relay (central point of weakness)
    2. Best builders get better latency, exclusive orderflow, and better search relationships, which make the market uncompetitive and more centralized.
    3. **Encrypted mempools** are a hot topic to reduce mempool-based MEV
    4. MEV redistribution and MEV burn



