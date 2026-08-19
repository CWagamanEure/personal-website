# The Bernoulli and Binomial Distributions

## Intro

- The extent of my experience involving **random variables**, prior to beginning this learning plan, involved instances where probabilities of events were equal to one another, and I could just count my way out of using them. To be honest, up until a few days ago, I didn't truly understand the need for random variables, not considering that probabilities of events can vary just as well as the sample space. 

- What I mean by this is, when I was assigned the problem of determining the **number of dice rolls needed to maximize the probability of rolling exactly one 6**, I chose to approach the problem by counting the numerator and denominator in reference to a number of rolls X, and then setting the derivative equal to zero. 

- This approach to solving the problem is very effective and probably the best way to go about it, but falls off the map when we are told that the probability of rolling the various sides are not equal. In this sort of problem, the best approach is to model it using a random variable that considers each individual probability.

## What is a Bernoulli Random Variable

- A Bernoulli random variable is used to model events which have binary outcomes. The most famous instance of this is with the good old coin flip, which has only two possible outcomes which sum to a probability of one. Essentially, Bernoulli is an indicator of having a successful outcome in a trial. 

- We can model a coin flip by saying that a random variable X follows a Bernoulli(p) distribution where p is the probability of landing heads. The PMF of X is given by

### $P[X = 1] = p$
### $P[X = 0] = 1-p$

- Where 1 represents heads and 0 represents tails

- We can also choose to write this PMF as $P[X = k] = p^k(1-p)^{1-k}$ for k = 0,1 


## What is the Binomial Distribution

- The binomial distribution, once again, is something that we have been dealing with since the beginning, but have just failed to name. 

- Where the Bernoulli is used to model events with two outcomes summing to a probability of 1, the Binomial is just **the number of successes in n independent Bernoulli trials with the same success probability p**. 

- The best example of this distribution is in modelling the outcome of a dice roll, where there are 6 possible outcomes, and you must determine the probability of rolling a specific side. Each roll is then a Bernoulli trial with $p = \frac{1}{6}$ (assuming a fair dice), and after n rolls the number of sixes is binomial. 

- If the success probability changes from trial to trial, the count of successes is no longer binomial.

- Here is the PMF: 

### $P[X = k] = \binom{n}{k}p^k(1-p)^{n-k}$ where n = total trials, k = successful trials

- Intuitively, $\binom{n}{k}$ counts how many ways you can choose which k trials were successes, and $p^k(1-p)^{n-k}$ is the probability of any specific success/failure pattern with k successes.

