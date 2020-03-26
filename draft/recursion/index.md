# 재귀

재귀는 함수가 스스로를 서브루틴으로 호출하여 문제를 해결하는 접근 방식을 말한다.

You might wonder how we can implement a function that calls itself. 

매번 재귀적으로 스스로를 호출할때마다, 부분문제로 나누어 문제를 해결한다.

재귀함수에서 무한루프가 발생하지 않기 위해서는 다음과 같은 속성이 필요하다.

베이스케이스(base case) 재귀가 멈추는 

The trick is that each time a recursive function calls itself, it reduces the given problem into subproblems. The recursion call continues until it reaches a point where the subproblem can be solved without further recursion.

A recursive function should have the following properties so that it does not result in an infinite loop:

A simple base case (or cases) — a terminating scenario that does not use recursion to produce an answer.
A set of rules, also known as recurrence relation that reduces all other cases towards the base case.
Note that there could be multiple places where the function may call itself.

