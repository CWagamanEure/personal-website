# Inclusion-Exclusion 

### $|\bigcup_{i=1}^nA_i| = \sum_{k=1}^n(-1)^{k-1}\sum_{|I|=k}|\bigcap_{i\in I}A_i|$

## When is it used

- Inclusion-Exclusion is primarily used for probability questions which involve the **union** operand.  

- If we want to find the probability that A **OR** B occurs, we add them and subtract their overlaps: $P(A\cup B) = P(A) + P(B) - P(A\cap B)$ 

- **$A \cup B = A \cup (B\setminus A)$** (where $B\setminus A$ is the part of B not in A)

- For three sets:

- **$ |A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$**

- In this case, you add the singles, subtract the pair overlaps, and add back in the overlap of all three, which was removed too many times.  

## Probability as a continuous set function

- This is a little bit of a side note which I'm choosing to include here because it is a useful theoretical concept for problems I plan to discuss below.

- Inclusion-exclusion is a **finite** identity for unions of events and generalizes to n events. 

- In the case of continuous set functions, there are two cases with which the theory can provide some insight into solving related problems.

- These are increasing and decreasing events:

1. An increase sequence of events means $E_1 \subseteq E_2 \subseteq E_3 \subseteq ...$. As n grows, you keep adding outcomes, meaning that the event can only get larger. Because of this growth in the event sample space, we can represent the event that eventually happens as $\bigcup_{n=1}^∞E_n$

2. In the case of decreasing events $E_1 \subseteq E_2 \subseteq E_3 \subseteq ...$, you keep removing outcomes as n growws. This means that the event can only get smaller. As you approach infinity, the event that can survive forever is the outcome that remains in all of them: $\bigcap_{n=1}^∞E_n$


## Problems

### The Matching Problem

- **Question** - Suppose that each of n men at a party throws his hat into the center of the room. The hats are first mixed up, and then each man randomly selects a hat. What is the probability that none of the men selects his own hat?

- **Solution** - You can think about this problem as each person's success being an event.

- $A_i$: "person i gets their own hat"

- $\bigcup_{i=1}^nA_i$ means that **at least one person** gets their own hat (OR over all people)

- $A_i \cap A_j$ means $A_i$ AND $A_j$ happen (both people get their own hats)

- $A^c$ means that "NOT A" (remember complements)

- So, the event we want is $\left(\bigcup_{i=1}^n A_i\right)^c$ i.e. **"no one gets their own hat"**

- Therefore P(no one matches) = $1 - P(\bigcup_{i=1}^nA_i)$

- My first intuition would be to add up all the probabilities that each person finds their hat and subtract that from 1. The **issue** is that this method overcounts the instances where two people match, which is exactly what **inclusion-exclusion** can solve. This allows us to subtract out the pair overlaps $A_i \cap A_j$

- Following with the simple principle of inclusion-exclusion, with greater than three sets, we must also add back in the instances where three people get their own hats.

- Thus, using the simple formula, we can conclude:

### $\left|\bigcup_{i=1}^n A_i\right| = \sum_{k=1}^n (-1)^{k-1}\binom{n}{k}(n-k)!$ 

### $\left|\left(\bigcup_{i=1}^n A_i\right)^c\right| = n! - \left|\bigcup_{i=1}^n A_i\right| = \sum_{k=0}^n (-1)^k\binom{n}{k}(n-k)!$

- To turn this into a probability, we divide the result by the number of total possibilities, which is n!.

- This formula looks intimidating but can be broken down as:

- For each k, we are choosing which k people match with their hats $(\binom{n}{k})$, permuting the rest $(n - k)!$, then alternating with the -1 to correct overcounting. Then, we subtract that value from the total number of ways to pair hats with men, to find the instances where none are correctly paired to satisfy the question.





