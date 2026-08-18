# Dyck Paths and Catalan Numbers

## Dyck Path (staircase model) 

- Catalan numbers and Dyck Paths are pattern that shows up in cases where we must count the number of paths/objects where there an equal amount of two types of objects initially, and the problem wants you to count the number of paths/objects that never go over a threshold.

- With a Dyck path, you can visualize it as moving with a right step as $R = (x + 1, y)$ or up step as $U = (x, y + 1)$. The condition is that the paths are never supposed to cross the diagonal y = x line 

## Catalan number 

- A **Catalan Number** is just the famous counting sequence that shows up whenever counting structures that are intended to never cross.

- Catalan shows up here because we are counting the sequences with an equal total number of two step types (same number of R's and U's), along with a prefix constraint (never cross a threshold). This is the same as the popular "balanced parenthesis" question where you can never have more closing than opening at any point. 


## Catalan Formula

- The number of Dyck paths of semilength m is the Catalan number

# $\binom{2m}{m} - \binom{2m}{m + 1} = $

# $C_m = \frac{1}{m + 1}\binom{2m}{m}$

## The reflection principle

- from (0,0) to (m,m) there are $\binom{2m}{m} paths. By reflection, bad paths to (m,m) are in bijection with all monotone paths to (m - 1, m + 1), so the number of bad paths is $\binom{2m}{m + 1}.

- More simply, as I describe in more detail below, an easier way to count the bad paths is to count the number of paths that form a bijection with the reflected paths.

### What is a bad path

- A bad path, in the case of Dyck Paths, is one that at some point goes above the diagonal y = x. 

### The reflection map

- The reflection trick involves finding the location where the path becomes bad, and geometrically reflect across the line for both the R and U paths.

## Example questions

### 1. $N(n,1)$ = Dyck paths from (0,0) to (n,n) that touch the diagona; exactly once, excluding (0,0)

- **Solution**

- Every Dyck path must end at (n,n), which is on the diagonal. So if the path touches the diagonal earlier at some (k,k) then it would touch (k,k) and at (n,n), which is at least two touches

- **The trick** - If the path has to stay under y = x except at the endpoints, then:

1. First step must be R (to stay under the diagonal)
2. Last step must be U (to hit the diagonal)

- If these are requirements, we can remove them and shift the picture to give us a standard Dyck path of length n-1

- Using the Catalan formula:

# $N(n,1) = C_{n-1} = \frac{1}{n}(\binom{2n - 2}{n - 1})$


### 2. **Unequal Counts** You have 8 R-steps and 5 U-steps (so you go from (0,0) to (8,5)). How many step-strings of length 13 never go above the diagonal y = x? 

- **Notice**: This problem is a slight step away from the Catalan Number and Dyck Path, as it does not have equal totals. This type of problem falls more into the **ballet-theorum** category.

- **Solution**

- First you would count all paths, resulting in $\binom{13}{5}$ total paths.

- A bad path is one where some point goes above the diagonal. The number of bad paths is $\binom{13}{4}. We come to this conclusion by finding an easier way to count bad paths by finding a bijection, where we count the total number of paths that go to the reflected endpoint of (4,9) (which is (8, 5) reflected over the x=y line).  

- The solution is the total paths minus the bad paths, being:

$\binom{13}{5} - \binom{13}{4}$


## Steps to solving general ballot problems

1. Good = All - Bad
2. Find bijection of bad 
   - Sometimes this bijection can take the form of reflected endpoints, other times shifted start point or generalized ballot form (which will be covered in more detail in a later blog)



