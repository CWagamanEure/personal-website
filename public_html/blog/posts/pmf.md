# Probability Mass Functions


## What is a PMF

- A **probability mass function** is a function that gives the probability of a **discrete random variable** having a particular outcome. For a discrete random variable X, we define the probability mass function p(a) of X by $p(a) = P(X = a)$

- Essentially, once we have the PMF, we can compute probabilities directly without re-doing counting arguments each time. The PMF itself is usually derived from a sample space model (still using counting or symmetry). Pretty much you can plug the value 'a' into the function and be given a probability as an output.

- A function p() is a valid PMF only if:

1. $p(a) \geq 0$ for all a

2. $\sum_{a \in S} p(a) = 1$ 

## Discrete random variables

- I should also probably define **discrete random variable** as well. A discrete random variable is a real-valued function on a sample space whose range (**support**) is finite or countably infinite. What separates it from the **continuous random variables**, that we will cover later, is that continuous random variables fill intervals of real numbers. 

- An example of a discrete random var is the number of orders in an orderbook by time t. You can count each individual event. Order arrival *times* are usually treated as continuous.

## Example of pmf

1. Suppose we are flipping a coin with probability of heads 0 < p < 1 three times. Let X be the random variable that counts the number of heads obtained in the 3 flips. Find the PMF of X.

- **Solution**

- Lets assume that this blog wasn't titled "Probability Mass Functions" and we weren't sure whether this was a question on discrete or continuous random vars. The way that we can determine that this question is involving a function of discrete events is by realizing that coin flips are countable events, in this case 3 of them. 

- Here, we can define the sample space as:

### {HHH, HHT, HTH, THH, THT, TTH, HTT, TTT}

- Here, from past blogs we already know that the probability of getting any of these outcomes is just the probability of each individual flip multiplied together. We can then create an equation for each of these instances:

### $P[X = 3] = P[{HHH}] = p^3$
### $P[X = 2] = P[{HHT, HTH, THH}] = 3p^2(1-p)$
### $P[X = 1] = P[{TTH, HTT, THT}] = 3p(1-p)^2$
### $P[X = 0] = P[{TTT}] = (1-p)^3$


- These equations define the PMF for this problem.

- The more compact binomial form is:

### $P(X = k) = \binom{3}{k}p^k(1-p)^{3-k}, k=0,1,2,3,$


