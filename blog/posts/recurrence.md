# Recurrence

- A recurrence defines $a_n$ in terms of previous terms (like $a_{n-1}$, $a_{n-2}$)

## Order

- The number of previous terms needed to solve a recurrence is it's order. For example, with an order-2 recurrence, to compute the nth answer, you must solve for the solutions to the two designated values of n.  

- Coming from a background with some minimal experience with dynamic programming, it through me off to find out that **"solving a recurrence"** meant converting that recursive definition into a closed form that depends only on n (and constants), not on previous terms.

- In most DP problems, the recurrence is typically non-linear because they rely on **min/max over choices** or **2D/3D state tables** (or other complications and constraints). 

## Linear Recurrence

- As it sounds, a recurrence is linear if its terms appear only in a linear combinations. This means that each terms is multiplied by something that does not depend on the sequence itself and the terms are not multiplied together or put inside nonlinear functions.

- These types typically have solutions that are boiled down to a plug and chug formula.

## Homogeneous Recurrence

- Homogenous recurrence is about whether the recurrence has an extra standalone term that doesn't involve in the sequence. This term can be a function of n or just a constant, as long as it doesnt rely on any values of a.



## Common types

### First Order Linear Homogeneous
#### $a_n = ca_{n-1}$

#### Solution:
**$a_n = A * c^n$**

### First Order Linear Non-Homogeneous
#### $a_n = ca_{n-1} + f(n)$




### Second Order Linear Homogeneous 
#### $a_n = c_1a_{n-1} + c_2a_{n-2}$


#### Solution when polynomial $r^2 - c_1r - c_2 = 0$ has two distinct roots $r_1$ and $r_2$:
**$a_n = A * r_1^n + B * r_2^n$**


#### Solution when polynomial $r^2 - c_1r - c_2 = 0$ has a single repeated root:
**$a_n = (A + Bn)r^n$**


## Example problems

### 1. $a_n = 4a_{n-1}  where a_0 = 3

- To solve this one, you must know the form that is associated with **first-order homogenous linear recurrences**. This form is: **$a_n = A * c^n$**.

- **Solution**: Using the equation, all that is needed is to plug in the value for $a_0$ and c. This results in the solution of **$a_n = 3 * 4^n$**.

### 2. $a_n = 2a{n-1} + 3a{n-2}$ where $a_0 = 0$ and $a_1 = 8$

- To solve this problem, you must recognize that this is a **second-order homogenous linear recurrence** which requires that we solve the polynomial **$r^2 - 2r - 3 = 0$** to determine the correct form and values to solve for the coefficients.

- **Solution**: When solving the polynomial, we determine that the roots are distinct, being 3 and -1. This allows us to determine form of the solution to be **$a_n = A * 3^n + B * (-1)^n$**. Now we must solve for those values of A and B using the originally provided values of $a_0$ and $a_1$.

- When we set the equation to each of those values for n=1 and n=2, we find that A=2 and B=-2, making the solution **$2 \* 3^n - 2 \* (-1)^n$**.


### 3. $6a_{n-1} - 9a_{n-2} where $a_0 = 0$ and $a_1 = 6$

- Once again, this is an instance of a **second-order homogenous linear recurrence**. When we solve the polynomial **$r^2 - 6 + 9$**, we get r = 3. 

- **Solution**: When solving for A and B, we get A = 0 and B = 2. This gives us the solution: **$a_n = 2n3^n$**


