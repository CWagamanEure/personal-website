# Prediction Market Notes

## Types of contracts

### **Winner-take-all** 

- Price represents a probability. The contract costs $p and payout is $1 to winners, bid according to value of $p. Price of contract represents probability of event occuring. 

### **Index** 

- Reveals the mean of the event. An example would be if a contract pays $1 for every percentage point of the popular vote a presidential candidate gets. So, if the market trades around $51, the market is predicting the candidate gets 51 percentage points. 

### **Spread**

- Reveals the median of an event. Built around a cuttoff, similar to a strike price. The contract might cost $1 and pay $2 if the outcome of the event is greater than the expected outcome, and $0 otherwise. 

## The Saddam Security

- Stumbled across an older prediction market which had a payout if Saddam Hussein was ousted by the end of June 2003. The price of this market followed exceptionally well with the price of oil during that period.

- Clearly there is not only the possibility of constructing complex hedging securities, but also for developing cointegrating portfolios using these markets.

## Terrorism markets

- Historically, the big "terror markets" controversy was DARPA's Policy Analysis Market, which was attacked politically as "betting on terror."

- This may be a quite contrarian take but I think that markets betting on terrorist acts (such as the Saddam Security mentioned above) may have some benefits in providing insider info. I think the hate that these markets got may have been slightly mischaracterized and were actually intended to forecast geopolitical risks instead of incentivize violence.

- Also, I find it hard to believe that a prediction market on this topic (with specific restrictions) would influence a terrorist organization to make any sort of decision that they could not already profit off of by trading against oil futures or the market as a whole.

- There are definitely some valid questions on public trust and the moral hazard of outcome control. 

## Favorite-long shot bias

- Although it is very clear that these markets are incredibly efficient, even across multiple venues, there does exist an anomoly in pricing small probabilities and near certanties, where the former are consistently overvalued and the ladder are consistently undervalued. This may indicate that prediction markets may perform poorly in assigning an accurate probability to less likely events.

## Trading with values

- It has also been noted that some market participants will choose to bet on outcomes associated with their specific values or personal afilliation instead of the most probable result. Although this is an interesting note, it is very unlikley that, especially in more liquid markets, this will have an impact on market pricing, as there will be corrective traders to correct their mistakes.  


## Prediction markets as random variables

- Recently, I have been devoting most of my time to studying probability and stats and am incredibly excited to apply my newly acquired knowledge (although limited) to prediction markets.

- Building an implied discrete distribution over y using prediction market ladder thresholds. 

- Law of total probability and Bayes

## My take on the gambling argument

- I constantly find anti-prediction market arguments which like to make the case that these markets (especially decentralized versions) are just locations for gambling. It's entirely possible that I'm just misunderstanding what "gambling" truly is, but from my view, it is very clear that these markets have many utilitarian use cases that go beyond just speculative trading. Calling them 'gambling' confuses speculation with wagering: the same contract can be pure speculation for one trader and a variance-reducing hedge for another. 

- In essence, prediction markets are contingent claims on real-world events, often implemented as binary payoffs, sometimes as scalar payoffs. Not only do they complete more states in the market, thereby allowing for greater informational reflection of higher risk dimensions in prices, but they also have so many interesting applications for constructing hedging instruments applicable to a wider variety of real world circumstances. An example of using a prediction market as a hedge is a business whose margins get crushed if CPI YoY is greater than 4% next print. In this case, the business can buy that market's payoff as insurance (even if it's imperfect or basis-y). 

- They also provide utility in their capacity to be outcome markets in informational aggregation. From an economist perspective, these markets can seriously improve decision making and regulation on very large scale. 

- It may be the case that the vast majority of traders are using these markets to speculate (gamble) on event outcomes, but the same can be said about securities futures markets and spot markets in general. The optimal decision for all uninformed traders in any market is to just not trade at all, this stays the same for prediction markets. 

- I do also recognize that there are some fundamental flaws with prediction markets that need to be addressed, specifically along the lines of market manipulation. While I am in the boat that insider trading is beneficial to these markets (not neccesarily the uninformed traders within them) for price discovery, there is the consideration of insider control which actually should be addressed. The key line is information advantage vs outcome control. I believe that stuff along the lines of insiders actively manipulating events, such as ICO date changes by insiders for profit, are not conducive to healthy markets. The ability to influence outcomes is moral hazard and creates perverse incentives. 

## Sources

[Prediction Markets - Wolfers, Zitzewitz](https://pubs.aeaweb.org/doi/pdfplus/10.1257/0895330041371321)

