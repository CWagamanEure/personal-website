Title: Maximum Likelihood Estimation 
Date: 2026-08-19
Summary: Estimating a data generating distribution.  
Tags: estimation, mle, probability
Draft: true

Suppose we are trying to estimate a data generating distribution given we have observed $x_1 \dots, x_n$. 

Maximum liklihood answers this

Maximum likelihood answers this by asking a narrow question: among all the
values $\mu$ could take, which one makes the data we actually saw the least
surprising? The likelihood of the sample under a candidate $\mu$ is the product
of the individual densities, and since products of small numbers are unpleasant
to work with we take logs:

$$\ell(\mu) = \sum_{i=1}^{n} \log f(x_i \mid \mu, \sigma) = -n\log(\sigma\sqrt{2\pi}) - \frac{1}{2\sigma^2}\sum_{i=1}^{n}(x_i - \mu)^2$$

The estimator is the argmax. Only the last term depends on $\mu$, and it is a
sum of squares, so differentiating and setting to zero gives something
familiar:

$$\hat{\mu} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

The maximum likelihood estimate of a normal mean is just the sample mean. That
result is easy to state and easy to under-appreciate, so it is worth seeing
what the likelihood surface actually looks like.

<div data-demo="mle-gaussian"></div>

The left panel is the sample: a histogram, a rug of the raw observations, the
true density dashed in orange, and the fitted density in green. The right panel
is $\ell(\mu)$ computed from that same sample, shifted so its peak sits at
zero. Both panels share an x axis, so the peak on the right sits directly under
the data that produced it.

## The peak moves less than you would expect

Pull the sample size down to 10 and press *new sample* a few times. The fitted
density on the left jumps around noticeably, but $\hat{\mu}$ stays in the
neighborhood of the truth more often than the wobbling curve suggests. The
sample mean is a stubborn estimator; it takes a genuinely unlucky draw to move
it far.

## The shape is the real story

The more interesting change is on the right. At $n = 400$ the log-likelihood is
a narrow spike: values of $\mu$ half a unit away from $\hat{\mu}$ are already
several log units less likely, meaning the data have all but ruled them out. At
$n = 10$ the same curve is a shallow bowl. The estimate is still the sample
mean, but the sample no longer contains enough information to distinguish it
from its neighbors.

That is what the shaded band shows. It is $\hat{\mu} \pm 1.96\,\hat{\sigma}/\sqrt{n}$,
and it widens exactly as the curve flattens, because the two are the same fact
seen from different angles. Differentiating $\ell$ twice gives

$$-\frac{\partial^2 \ell}{\partial \mu^2} = \frac{n}{\sigma^2}$$

the Fisher information. The curvature of the log-likelihood at its peak *is*
the precision of the estimator: sharply peaked means confidently estimated,
flat means the data are nearly indifferent. Raising $\sigma$ flattens the curve
for the same reason lowering $n$ does — noisier observations and fewer
observations both buy less information per unit of data.

A point estimate on its own hides all of this. It reports where the peak is and
says nothing about whether there is a peak worth speaking of.
