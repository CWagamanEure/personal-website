# Sample Spaces, Events, and Axioms 

## Sample Space

- A **sample space** $\Omega$ is the set of all possible outcomes. 

## Events
- **Events** E are subsets of the sample space. $ E \subseteq \Omega$ 

- **Outcomes** are individual results. An event occurs when the outcome lands in the sample space. 

### Union and Intersection

- Suprisingly, I ran into the use of unions, intersections, and other forms of relations well before beginning my studying of computer science. One of the first courses that I ever took in college, in the first semester of my freshman year, was a course in logic. Although it was an entry level course for the philosophy tracks, it is a course that I highly recomend for its breadth and application in all types of disciplines. That course played a major role in my decision to study computer science. 

- Events within a set or multiple different sets can be compared using relations such as union and intersection. One of the most intuitive ways to understand these concepts is by drawing the good old venn diagram. 

- We can define a new event to occur if event E or event F occurs. This is **union $\cup$**. This new event occurs if either or both events E and F occur.

- Union can also be expressed with: $P(E \cup F) = P(E) + P(E^c \cap F)$

- This just means that the probability of E or F occuring is the same as the probability of E plus the probability that E doesn't occur and F does.

- An example of **union** is the probability that, when picking a card from a deck, you pull a heart **OR** a king. 

- **Intersection $\cap$**, on the other hand, defines a new event on where event E and event F both occur together.

- An example of **intersection** would be the probability of first getting an Ace **AND** second getting a King, when pulling from a deck. 


### Null Event $\emptyset$

- A **null event** is the **empty event** which contains no outcomes in the sample space. This means that the event is impossible and has a probability of zero. 

- **Mututally Exclusive** - Mutually exclusive events refers to events with which the probability of both occuring together is zero. $ P(E \cap F) = 0$ 


- **Complements** are events with which the probability of them occuring sums to 1. $E^c = \Omega \setminus E$ and $P(E^c) = 1 - P(E)$ $ P(E^c) + P(E) = 1$ 


### Independent vs Dependent

- This is where probability starts to get super exciting. Dependence of events adds another dimension to their complexity, which alters the way you go about determining probability. 

- **Dependent** events are those events with which the outcomes depend on the outcomes of other events in the sample space. **Independent** events are those with which the outcome does not rely on other outcomes.

- A very simple example of this, which we have dealt with when counting, is the usage of replacement vs non-replacement. For example, when a card is drawn from a deck, and not replaced, the outcomes of subsequent events involving drawing from the same deck of cards are altered. These are **dependent** events. 

- More formally, events E and F are independent if $P(F | E) = P(F)$ and $P(E \cap F) = P(E)P(F)$


### Contained and Subset

- If an event contains the outcome of another event, it can be represented by the symbol: $\subset$. If event A contains event B, we write: $B \subseteq A$.

- For example, if event A has an outcome set of {2,4,6}, and B = {2}, we can say that A contains B and is a subset of A $B \subseteq A$


## Probability

- **Probability** - Probability is a rule that assigns to each event a number between 0 and 1 representing how likely it is to occur. 

- A **probability function** P assigns each event E a number $P(E) \in [0,1]$ consistent with the axioms.

- Probability works so that as the number of **repated trials** approaches infinity, the frequency of occurence approaches the derived probability value. This idea is known as the **law of large numbers**.

## $P(E) = \lim_{n \to \infty} \frac{n(E)}{n}$

### Probability as a measure of belief

- Probability is often used in different ways, one of which being what we have looked at: the **frequentist view**. With this framework, probability is identified with the long-run relative frequency of an outcome in repeated trials.

- In the **subjective/Baysian** view, probability represents an agent's degree of belief in a proposition.

- This may be in the form of: "There is a 80% probability that this article was written by Thomas Jefferson." 

- Event when interpreted as a belief, rational probability assignments are still subject to the axioms discussed below.






### Axioms

- The **axioms of probability** must be satisfied by the probability of each event E in a sample space S. These axioms are:

## 1. $0 \le \Pr(E) \le 1$

- Axiom one defines the requirement that the probability of an event occuring must be inclusively between 0 and 1.

## 2. $P(\Omega) = 1$

- Axiom two requires that the probability that the outcome lies in the sample space is 1. 

## 3. $\Pr\!\left(\bigcup_{i=1}^{\infty} E_i\right) = \sum_{i=1}^{\infty} \Pr(E_i)$
- Only if the $E_i$ are pairwise disjoint.

- Axiom three requires that, with a list of mutually exclusive events within a sample space, the probability of at least one of the events occuring is the sum of all of them. 




