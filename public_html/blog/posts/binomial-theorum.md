# The Binomial Theorem 

$$
(a+b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k
$$

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!}
$$


## What is the Binomial Theorem

- The binomial theorem is a formula for simplifying binomials that are raised to large powers. When the exponent of a binomial gets larger, it gets increasingly more difficult to use the FOIL method. This formula provides a method for simplifying terms using counting. 

## Deriving the Binomial Theorem

- Lets say that we have a binomial equation of:

$$
(a + b)^3 
$$

- Naturally, we could just foil this equation out to give us:


$$(a + b)(a + b)(a + b)$$


$$= a^3 + 3a^2b + 3ab^2 + b^3$$


but, for increasingly more complex binomials it is more difficult to do this same process.

- With the typical FOIL expansion process, you would either pick a or b to multiply by at each expansion. This is represented in the binomial theorem by the equation:

$$
a^{n-k}b^k
$$

where k is the number of times that b was chosen, and n-k is the number of times that a was chosen (what is left).

- Where the choose notation comes in, is when we need to determine the number of times that 

$$
a^{n-k}b^k
$$

- When expanding $(a + b)^n$, each term comes from picking b from exactly k of the n factors (and a from the rest). The number of ways to choose which k factors contribute b is $\binom{n}{k}$.

- Then, the last step is to use summation to add up all the different possible components.

## Example

- As an example we can use the equation: 

$$
(2a - b)^{75}
$$

- Remember the form:

$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} (y)^k
$$

- In this instance, x=2a, y=-b, and n=75

- Using this information, we can produce the equation:

$$
\sum_{k=0}^{75} \binom{75}{k} 2a^{75-k} (-b)^k
$$

- Using this formula, given any value of k, we can find the number of times that the specific 'set' showed up in the equation.

**Example: What is the coefficient of the $a^{50}b^{25}$ term in the same above equation?**

- From the question we can just plug the given values into the equation to get an answer.

- Here, we can find that k=25 and 75-k=50. We can plug these values into the equation to get:

$$
\binom{75}{25} (2a)^{50} (-b)^{25}
$$


- The coefficient can be represented as: $-2^{50}\binom{75}{25}$


## Binomial PMF Questions 
























