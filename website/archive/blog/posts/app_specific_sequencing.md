# App Specific Sequencing (ASS)

## What is it

- The way I like to think about **App Specific Sequencing** is as PBS but one layer down. Rather than determining who builds the whole block, we are now determining who sequences a specific app's orderflow.

- The way it works is that the specific decentalized application will assign designated sequencers to construct bundles using the app's own mempool. The transactions are constructed so that they're agnostic to where the bundle ends up in the L1 block. 

- This is essentially the app specific network deciding on ordering and relying on Ethereum to settle the results. 


## Sorella Labs' solution to LVR

- In the case of Sorella Labs' own Angstrom, ASS is utilized to allow for arbitrageur value to be returned to the underlying liquidity providers. 

- Arbitrageurs bid for the right to be the first swap, while users submit intended swaps as signed limit orders to the Angstrom mempool. 

- The network then forms a bundle where the first swap is the highest bid. That bid is distributed pro-rata to the LPs, and the rest clears at a uniform clearing price. 

- The bundle is then sent to Ethereum builders for the Ethereum finalization process. 



