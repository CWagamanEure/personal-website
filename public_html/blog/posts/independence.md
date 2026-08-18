# Types of Independence

## Intro

- Feeling uncharacteristically tired today, so this one will cover a topic that seems very simple, but can have huge implications for properly modeling independent and dependent events.

- This is the difference between **unconditional independence** in **pairwise** and **mutual** independence, and **conditional independence**. 

## Past Discussion

- In previous notes I introduced the idea of independent vs dependent events, describing the independence of two events to be defined by whether the probability of event E occuring, given event F occuring, is the same without F occuring. $P(E | F) = P(E)$. Independence must also fulfill the equivalent property: $P( E \cap F) = P(E)P(F)$.

- This definition is true, but becomes slightly more nuanced in scenarios involving more than two events.

## Mutual Independence

- With the addition of more events, we can still say these same principles are true if the events are **mutually independent**.

- For example, if we have events E, F, and G, we can say these events are mutually independent if:

$P(E \cap F) = P(E)P(F)$
$P(E \cap G) = P(E)P(G)$
$P(F \cap G) = P(F)P(G)$
$P(E \cap F \cap G) = P(E)P(F)P(G)$

- Here, we can see that for events to be regarded as mutually independent, they must satisfy the same identity with eachother in pairs, and also in sets.

## Pairwise Independence

- **Pairwise independence** is a much more lenient form of independence which doesn't require the final independence between the set. Just as it says in the name, it only requires that events are independent in pairs.

$P(E \cap F) = P(E)P(F)$
$P(E \cap G) = P(E)P(G)$
$P(F \cap G) = P(F)P(G)$

## Real Example

- A great example of the difference, in a real world setting, is through a good old coin flip example.

- Lets say that we are flipping a coin three times and define the event $H_{ij}$ to be the event that the outcomes on flips i and j are the same. 
Our goal is to determine whether the events of $H_{12}, H_{23} and H_{13} are pairwise independent and mutually independent. 

- **Solution** - 

- Naturally, we can solve for mutual independence, then use part of the solution to gauge pairwise independence as well.

- Because the probability of getting any one of these events is $\frac{1}{2}$, we can write that $P(H_{12}) = P(H_{23}) = P(H_{13}) = \frac{1}{2}$. 

- We also know that an intersection of any two of these events means that all three flips result in the same side. The probability of getting all three of the same side comes down to whether the second two flips match the first. Therefore, the first flip doesn't matter. The probability that the second two flips match the first is $\frac{1}{4}$. This means that:

$ P(H_{12} \cap H_{23}) = P(H_{23} \cap H_{13}) = P(H_{13} \cap H_{12}) = \frac{1}{4}$. 

- Now we can affirm that the events are **pairwise independent** because $P(H_{12} \cap H_{23}) = P(H_{12})P(H_{23})$ for every pair combination of events $H_{ij}$ 

- To determine whether the events are **mutually independent** we must test the final identity:

$P(H_{12} \cap H_{23} \cap H_{13}) = P(H_{12})P(H_{23})P(H_{13})$

- Because the intersection of all three is, once again, the same as saying each coin should be the same side, we know that the answer to the left side of the equation is $\frac{1}{4}$. The right side is a simple multiplication of $\frac{1}{2}^3$ which is equal to $\frac{1}{8}$.

- Therefore, we can determine that these events are not mutually independent. 


## Conditional Independence

- It is also very important to understand the distinctions between **conditional** and **unconditional independence**. Both pairwise and mutual independence are types of unconditional independence.

- **Conditional independence** involves the another event C, where A and B are conditionally independent when $P(A \cap B | C) = P(A | C)P(B | C) (P(C) > 0)$.

- This just means that the probability of A and B occuring given C is the same as the probability of A given C times the probability of B given C. More intuitively, this implies that given C, learning B doesn't change the probability of A (and vice versa). Once C is known, A and B do not depend on one another.

## Example

- An example of **conditional dependence** is the simple example of two coin flips. Event A is the event that the first coin is heads and event B is the event that the second coin is heads. Here, A and B are clearly independent events. 

- They become conditionally dependent when we add the third event C: the event that at least one head occurs. Now, we can say that once we know the outcome of C, the outcome of A is now dependent on the outcome of B and vice versa.




