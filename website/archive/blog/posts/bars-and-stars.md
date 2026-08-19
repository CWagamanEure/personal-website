# Bars and Stars

- In past blogs, we have encountered instances of placing items into labeled buckets with size constraints, which has mainly taken the form of multinomial counting. An example of this type of problem would be: Organizing people in to specific groups of unique sizes. 

- Where the **Bars and Stars** technique comes in is when you are given n identical objects, and k distinct buckets to sort them into. 

## Example Problem

 Lets say that we are given 10 identical '*' (stars), and you are tasked with determining the number of ways you can place those stars into 5 labeled buckets. Assume that some buckets may be empty. 

- Practically, we can think of this problem as determining the number of ways to create a sequence of stars and the division boundaries between those stars which create the buckets, represented by '|' (bars).

- Because we have been tasked with creating 5 buckets, there would be 4 bars needed to show this (shown below).

   1    |  2   |   3   |    4   |    5  

- We can represent the number of bars needed with the equation: **k-1**

- Now we need to determine the number of ways that the stars can be placed in sequence with those bars. Below is one of many possible solutions (we will soon be able to assign a number to that use of 'many').

\*|\*\*\*|\*\*|\*\*|\*\*


- We can simply define this question as determining how many different ways the bars can be assigned positions. We can also say, positions choose bars, which can be written as:

$
\binom{n + k -1}{k - 1}
$

- **k - 1** is the number of bars needed. This makes the numerator just equivalent to the total number of stars and bars together (or number of spaces that need filling). The denominator is just the number of bars in the problem. 

- Essentially, we're arranging n stars and k-1 bars in a line; every arrangement corresponds to exactly one distribution of stars into buckets, and vice versa.

- This formula applied to our specific problem yields:

$
\binom{10 + 5 -1}{5 - 1} = \binom{14}{4} = 1001
$

- That makes 1001 ways of sorting 10 indistinguishable items into 5 labeled buckets. 

## Example 2

- Now lets assume that the buckets can no longer be empty. Let's use the same problem as before, with n=10 and k=5. 

- The way to approach this problem involves going ahead and pre-placing 1 item into each of the buckets beforehand, thereby removing them from the count. This can be represented by the below equation:

$ 
\binom{(10 - 5) + 5 -1}{5 - 1} = \binom{9}{4} = 126
$



















