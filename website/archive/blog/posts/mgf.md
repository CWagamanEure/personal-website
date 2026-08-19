# Moment Generating Functions (MGFs)

- Lets get back into studying probablity and stats by attempting to breakdown **Moment Generating Function** and their uses.

## What is it?

- Although I havn't yet posted any notes or blogs on **expectations** or on **variance** yet, I will do my best to explain as simply as possible. 

### Moments

- First of all, lets try and understand what a **moment**:

- A **moment** is the expected value of a power of a random variable.

- There are different categories of moments including:

1. **Raw nth moment**: $\mathbb{E}[X^n]$.
2. **Central nth moment**: $\mathbb{E}[(X - \mathbb{E}[X])^n]$.

- The first raw moment $\mathbb{E}[X]$ is the mean (expected value) of the random variable.

- The second central moment $\operatorname{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2]$ is the variance of the random variable.

- Higher (central/standardized) moments relate to the shape of the distribution of a random variable (skewness, kurtosis).


- They are often easier than computing each moment separately, because once you have $M_X(t)$, derivatives give $\mathbb{E}[X], \mathbb{E}[X^2]$,...

### MGFs

#### Discrete formula: $M_X(t) = \mathbb{E}[e^{tX}] = \sum{x}e^{tx}P(X = x)$

#### Continuous formula: $M_X(t) = \int_{\infty}^{-\infty}e^{tx}f(x)dx$

- MGFs are useful because:

1. You can get $\mathbb{E}[X]$, $\mathbb{E}[X^2]$, etc quickly from derivatives
2. MGFs (when they exist near zero) uniquely identify the distribution.

- Here are the steps for computing and using an MGF:

0. **Start from the definition**

- For a random variable X, the moment generating function is $M_X(t) = \mathbb{E}[e^{tX}]$ provided that this expectation is finite for t in some open interval around 0.

1. **Compute it as an expectation**

- If X is discrete with pmf $p(x) = Pr(X = x)$: $M_X(t) = \sum{x}e^{tx}p(x)$

- If x is continuous with pdf $f(x)$: $M_X(t) = \int^{\infty}_{-\infty}e^{tx}f(x)dx$

- Then you can simplify into a nice closed form.

2. **Use the derivative at zero to get the moments**

- $M^{(n)}_X(0) = \mathbb{E}[X^n]$

### Examples

#### Example A: Bernoulli(p) (discrete)

$X ∈ {0,1}, Pr(X=1) = p, Pr(X=0) = 1 -p$

- Compute the MGF: $M_X(t) = (1-p)e^{t\*0} + pe^{t\*1} = 1 - p +pe^t$

- **Moments**

- $M'(t) = pe^t => \mathbb{E}[X] = M'(0) = p$
- $M''(t) = pe^t => \mathbb{E}[X^2] = M''(0) = p$
- $\operatorname{Var}(X) = p - p^2 = p(1-p)$





