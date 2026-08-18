# My Discoveries While Learning to Count

## Disclaimer

I am very early in my learning journey, so everything I say here should be taken with a grain of salt. These blogs are less of informational finality and more of a student trying to maximize his learning potential.

## Motivation for learning probability and stats 
Recently, I have jumped in to the space of probability and statistics as a way of proving to myself that I can learn topics that I am not naturally good at. Today marks day 3. On multiple occasions in the past, I have started learning these topics in my free time and given up within a few days due to them being too overwhelming and the solutions not coming to me intuitively. Obviously, this is a big issue. Why should I only spend my time tackling problems and topics that I find easy and approachable? The process of learning requires that we struggle through challenging problems and develop our own ways of thinking and processing them. 

I constantly hear people say to find and focus on what you're naturally good at, and to not spend time on topics that you struggle with. This is sort of the economic concept of a competitve advantage, where the goal is to minimize your opportunity cost by focusing on producing the good or service that you best at, in reference to all other goods or services. While this is a fine idea in theory, I think we also should understand that the ability to learn something that you are not naturally good at, is a beneficial skill in it of itself, as it teaches us problem solving skills, which can be applied to your competitive advantage, but may also lead you to find something you are better at or enjoy more. 

Personally, I also beleive that your competitive advantage is not entirely set in stone, not given to you at birth, where your genes designate you to be the best at carpentry or plumbing. Some physical or genetic characteristics may influence your path to finding what you are good at, but your ultimate path is a direct product of your environment. Most people either get good at something that they love, or are influenced by their environment to persue something. All of that to say: spend some time learning and studying things that you are bad at relative to your peers. I recently saw a youtube video where a mathematician said, "If you are bad at something, all it takes is 2 weeks." (Or something like that, maybe not a direct quote).  

## What is counting and why is it useful.

The way I interpret counting in the probability sense, is **the means of computing the number of favorable outcomes and total outcomes to determine the probability of an event.**. This can take many forms, including determining the number of possible ways to split up a group of people between teams, or number of possible outcomes of flipping a coin 6 times. 

Obviously, each of these examples are unique in multiple ways, which I will attempt to explain in this article (along with ways for approaching a probability problem as a whole).

## How to count in my mind

When you first approach a probablity problem, there are some things you should consider before attempting to find the solution.

### What are we counting?

To begin, what has helped me tremendously is to first ask: What are we actually trying to count in this problem? This is the natural first step for my brain.

In most problems the question is either asking us to count the number of possible outcomes in terms of sets (combinations), where order doesnt matter, or in terms of sequences (permutations) where order does matter. 

What helps me, is to think: if we swapped two specific items, would the result change? If so, you are probably dealing with a question that is asking for permutations.

Here is an example of each situation:

1. **What is the total number of ways you can assign 16 people 1st, 2nd, and 3rd place at a competition?**

**Solution** One consideration you must also make here is that you can't award someone a first place position, then also award them the second place position, in this way, you must reduce your population by one person after every placement. The solution is **16x15x14 = 3360 possible ways**. Notice that we multiply the population for each position, incrementing the population down by 1 each time. 

**Notice** One thing that really tripped me up when going through problems and solutions to similar problems is the seeing notation: 

$\frac{n!}{(n-k)!}$ where n= # in population, k= # of spots

In reality, this notation is the exact same as what we have just done. The reason that we have it is so that when the number of slots gets increasingly larger, we can write a solution without having to write every single number out.

2. **What is the total number of ways you can pick 3 winners out of 16 candidates?**

**Solution** In this one, order clearly does not matter. Each of the three winners are indistinguishable from one another in their winning position. Therefore, in this instance we have a set. Once again, we don't want to resample the same person for each of the three winning positions, so we increment the population downwards by 1 each time. 

The solution can be boiled down to the equation: **$\binom{n}{k}$** which is read as "n choose k". This verbal representation of the equation is something that I have personally found very intuitive, as it clearly represents that n people (population) are tasked with choosing k spots. In this case, the k spots are indistinguishable from one another. 

This formula is also represented in the more obvious form of: **$\frac{n!}{k!}$**

The reason that we are now including the **k!** in the denominator, is to remove the total count by the number of same set pairs. You have probably noticed that the numerator is equivalent to the **first problem**, where order matters. So naturally, we want to reduce that original count by the number of times the same set was counted (just in a different order).

**notice** A set can be: [0 1 2 5], but there are multiple counts of that set which can have different orders. For example, in this problem we dont want to count [0, 2, 1, 5] and [5, 1, 2, 0] because they are equivalent in a set.

There is no sense of ordering when each of the winning positions are equal in name.

### is it buckets or sets?

Multinomial counting is what happens when outcomes fall into more than two labeled categories and you're counting how many ways the counts can occur.






 
 



























