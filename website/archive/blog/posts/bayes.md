# Bayes Theorum

## Formula

### $P(B_k | A) = \frac{P(A | B_k)P(B_k)}{\sum_iP(A | B_i)P(B_i)}$


## Derivation

- When I first stumbeled across the **Bayes Theorum**, it felt like I had come across a new beast of probability theory. The formula can look quite overwhelming at first, but becomes very intuitive when broken down into more simple rules of probability.

- From conditional probability we already know the equality:

### $P(A \cap B) = P(A | B)P(B)$

- Remember, intuitively, this is just saying that the probability of A and B occuring is the same as the probability of A occuring given B times the probability of B.

- And obviously, once we have that, we can also swap A and B to get:

### $P(A \cap B) = P(B | A)P(A)$

- The Bayes Theorum becomes very simple when you recognize that it comes into existence when setting the above two equalities equal to eachother, and solving for whichever x.

### $P(A | B)P(B) = P(B | A)P(A)$

- Then you divide by the P(B) to get the final formula:

### $P(A | B) = \frac{P(B | A)P(A)}{P(B)}$

## Applications

### Market Making

- I think one of the most exciting applications of Bayesian conditioning shows up in classic forms of financial market making strategies.

- The idea is that there exists an unobserved "true value" V and an observation of order flow which is a noisy signal of V.

- Where bayes comes into use is through the updating of P(V | buy) or P(V | sell)

- You can then quote your bid and ask based around the posterior expected value. 

- It is also used in the estimation of **order toxicity** where the formula: P(informed | recent trade patterns / LOB features) can be used to estimate probability of informed traders.

- Even today with the use of advanced machine learning algorithms, it's still conceptually a "Bayesian" signal.

### Regime Models (HMM / particle filters)

- Once again, Bayesian filtering is used to observe price and order-flow features and update your probability of being in each regime.  

- This semester I am taking a course in **State Estimation** which covers Kalman filtering and other state-space models. Expect to see future blogs on these topics. 

## Practice Problems

1. **Two boxes are in front of you. One box has a 100 dollar bill and a 1 dollars bill, while the other has 2 100 dollar bills. You pick a box at random and then pick a bill from it at random without replacement. It is an 100 dollar bill. Find the probability you select a second 100 dollars on the next draw.**

**Solution** - 

- To start, it is very clear that this problem involves conditional probability rules, where we are conditioning which box we initially chose on the fact that our first selection was a 100 dollar bill. 

- If we had chosen the first box, with the 100 dollar and 1 dollar bills, we would have a 50% chance of choosing the 100 dollar bill from it, and now a 0% chance of pulling another 100 dollar bill. If we had chosen the other, there would have been a 100% chance of selecting a \$100 bill, and therefore a 100% chance of choosing another.

- We need to solve: $P(B_1 | H) = \frac{p(H | B_1)P(B_1)}{P(H)}$ where $B_1$ is the event we chose box1 (with the 100 dollar and 1 dollar bills) and H is the event that we are conditioning on (that we pulled a 100 dollar bill as our first pull)

- Intuitively, we can determine that the probability we chose a 100 dollar bill given we selected box 1 is $\frac{1}{2}$, the probability $P(B_1)$ that we chose box 1 is also $\frac{1}{2}$, and the probability P(H) that we select a 100 dollar bill at all is $1 + \frac{1}{2}$. So we have:

$P(B_1 | H) = \frac{\frac{1}{2} * \frac{1}{2}}{\frac{2}{3}} = \frac{1}{3}$

- and therefore, because we are finding the probability that we selected box2:

- $P(B_2 | H) = 1 - P(B_1 | H) = 1 - \frac{1}{3} = \frac{2}{3}$









