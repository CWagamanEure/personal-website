# Explaining the Poisson Distribution

## The PMF

### $P[X = k] = \frac{\lambda^k}{k!}e^{-\lambda}$ for all integers $k \geq 0$

## Intro

- This is one of the formulas which I really struggled to understand from just looking at. With the ones that have come prior, I was atleast able to determine how I would solve the same problem with counting and translate that solution over to using random variables.

## When to use it

### Poisson is used when:

1. events happen **randomly in time**
2. at a **constant average rate**
3. and events in disjoint time periods are **independent**
4. chance of 2+ events in a small time slice is negligible

- Clearly there are a lot of assumptions which have to be made when using a Poisson distribution, which can be to your advantage when tasked with determining when to use it.


## Understanding it intuitively

- Thank goodness we have chatgpt because it has been irreplaceable in breaking down more complex topics.

- In order to understand where the formula comes from, I'm gonna break down a simple problem into counting steps, combining them in the end to the slightly complex formula we see above.

- **Question**: Volcano eruptions occur on average once every 3 months. Find the probability there are 6 volcanic eruptions in a given year.

- **Solution**

- The way that I first approach this is by standardizing the metrics we're using. Because the problem asks for an answer in years, we can convert the "once every 3 months" rate into 4 per year. This gives us a rate of $\frac{4}{n}$ where n is the number of equal chunks in a given year.

- Because we know that each chosen chunk of time has a probability of $(4/n)$ to contain an eruption, we can also determine the complement events (that the remaining chunks don't contain an eruption) to be $(1 - \frac{4}{n})^{n-6}$

- Next, we need to count the number of ways these 6 events can occur in the n chunks. Naturally, we can do this with $\binom{n}{6}$.

### So far we have $P(E = 6) = \binom{n}{6}(\frac{4}{n})^6(1 - \frac{4}{n})^{n-6}$

- Up until now, we have operated under the assumption of n total chunks per year, attempting to model continuous time in discrete intervals. The next step in this derivation becomes a little tricky because it recognizes that, as n approaches infinity (n total discrete intervals approaches continuous time), we can equate $\binom{n}{6}$ to $\frac{n^6}{6!}$. This is because, as n approaches infinity, subtracting 1 from it has no impact. So we can say:

### $\binom{n}{6}(\frac{4}{n})^6 = \frac{n^6}{6!}*\frac{4^6}{n^6} = \frac{4^6}{6!}$

- We can also convert $(1 - \frac{4}{n})^{n-6} = e^{-4}$ as a classic limit.

- Putting it all together we get:

### $P(E = 6) = \frac{4^6}{6!}e^{-4}$

- Now that we have completed the derivation, we can interpret each factor in the final product.

1. $4^6$: represents the "weight" for having 6 events when the average intensity is 4/year
2. $6!$: chooses 6 events without caring about their order 
3. $e^{-4}$: the "no-event" probability background from all the tiny chunks where no event occurs

- Using the information that we have gathered so far, we can also determine that the probability of a Poisson is maximized when $ \lambda = k$. Intuitively this makes complete sense because the probability of an event occuring, at the rate at which it is defined, is 1.





