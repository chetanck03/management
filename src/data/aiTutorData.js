export const aiSubjects = [
  {
    id: 'ds',
    name: 'Data Structures',
    code: 'CS301',
    icon: '🌳',
    color: '#6366f1',
    description: 'Arrays, Linked Lists, Trees, Graphs, Hashing',
    suggestedQuestions: [
      'Explain the difference between a stack and a queue',
      'How does a binary search tree work?',
      'What is the time complexity of quicksort?',
      'Explain hash collision resolution techniques',
      'How to implement a graph using adjacency list?',
    ],
  },
  {
    id: 'algo',
    name: 'Algorithms',
    code: 'CS302',
    icon: '⚡',
    color: '#8b5cf6',
    description: 'Sorting, Searching, Dynamic Programming, Greedy',
    suggestedQuestions: [
      'Explain dynamic programming with an example',
      'What is the difference between BFS and DFS?',
      'How does Dijkstra\'s algorithm work?',
      'Explain the greedy approach for activity selection',
      'What is the master theorem?',
    ],
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'CS303',
    icon: '🗄️',
    color: '#06b6d4',
    description: 'SQL, Normalization, Transactions, Indexing',
    suggestedQuestions: [
      'Explain the different normal forms in DBMS',
      'What is ACID property in transactions?',
      'Difference between clustered and non-clustered index',
      'Explain joins with examples',
      'What is a deadlock and how to prevent it?',
    ],
  },
  {
    id: 'se',
    name: 'Software Engineering',
    code: 'CS304',
    icon: '🏗️',
    color: '#10b981',
    description: 'SDLC, Agile, Design Patterns, Testing',
    suggestedQuestions: [
      'Explain the Agile methodology',
      'What are SOLID principles?',
      'Difference between waterfall and spiral model',
      'Explain the observer design pattern',
      'What is test-driven development?',
    ],
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'CS305',
    icon: '🌐',
    color: '#f59e0b',
    description: 'OSI Model, TCP/IP, Routing, Security',
    suggestedQuestions: [
      'Explain the OSI model layers',
      'Difference between TCP and UDP',
      'How does DNS resolution work?',
      'What is subnetting and how to calculate it?',
      'Explain the three-way handshake',
    ],
  },
  {
    id: 'toc',
    name: 'Theory of Computation',
    code: 'CS306',
    icon: '🧮',
    color: '#ef4444',
    description: 'Automata, Grammars, Turing Machines, Complexity',
    suggestedQuestions: [
      'Explain the difference between DFA and NFA',
      'What is a context-free grammar?',
      'How does a Turing machine work?',
      'Explain the pumping lemma',
      'What is the halting problem?',
    ],
  },
];

export const aiResponses = {
  ds: {
    'Explain the difference between a stack and a queue': `## Stack vs Queue

**Stack** follows **LIFO** (Last In, First Out) principle:
- Think of a stack of plates - you add and remove from the top
- Operations: \`push()\` (add to top), \`pop()\` (remove from top), \`peek()\` (view top)
- Time Complexity: O(1) for all operations

**Queue** follows **FIFO** (First In, First Out) principle:
- Think of a line at a ticket counter - first person in line gets served first
- Operations: \`enqueue()\` (add to rear), \`dequeue()\` (remove from front), \`front()\` (view front)
- Time Complexity: O(1) for all operations

### Code Example (Stack in C):
\`\`\`c
#define MAX 100
int stack[MAX], top = -1;

void push(int val) {
    if (top == MAX - 1) return; // Overflow
    stack[++top] = val;
}

int pop() {
    if (top == -1) return -1; // Underflow
    return stack[top--];
}
\`\`\`

### Key Differences:
| Feature | Stack | Queue |
|---------|-------|-------|
| Order | LIFO | FIFO |
| Insert | Top only | Rear |
| Delete | Top only | Front |
| Example | Undo operation | Print queue |`,
  },
  algo: {
    'Explain dynamic programming with an example': `## Dynamic Programming (DP)

Dynamic Programming is an optimization technique that solves complex problems by breaking them into **overlapping subproblems** and storing their solutions.

### Two Key Properties:
1. **Optimal Substructure** - Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems** - Same subproblems are solved multiple times

### Example: Fibonacci Numbers

**Naive Recursive (O(2^n)):**
\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
\`\`\`

**DP - Memoization / Top-Down (O(n)):**
\`\`\`python
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
\`\`\`

**DP - Tabulation / Bottom-Up (O(n)):**
\`\`\`python
def fib(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

### When to use DP:
- Problem has overlapping subproblems
- Problem has optimal substructure
- You need to find optimal (min/max) value
- Common patterns: Knapsack, LCS, Matrix Chain, Shortest Path`,
  },
  dbms: {
    'Explain the different normal forms in DBMS': `## Normal Forms in DBMS

Normalization is the process of organizing data to reduce **redundancy** and improve **data integrity**.

### 1NF (First Normal Form):
- Each column contains **atomic** (indivisible) values
- Each column contains values of a single type
- Each row is unique

### 2NF (Second Normal Form):
- Must be in 1NF
- No **partial dependency** (non-key attribute depends on part of composite key)

### 3NF (Third Normal Form):
- Must be in 2NF
- No **transitive dependency** (non-key attribute depends on another non-key attribute)

### BCNF (Boyce-Codd Normal Form):
- Must be in 3NF
- For every functional dependency X → Y, X must be a **super key**

### Example:
\`\`\`
Student(Roll_No, Name, Course, Department, HOD)

FDs: Roll_No → Name, Course
     Course → Department
     Department → HOD

// Transitive: Roll_No → Course → Department → HOD
// Not in 3NF!

// Decompose:
Student(Roll_No, Name, Course)
Course_Dept(Course, Department)
Dept_HOD(Department, HOD)
\`\`\`

### Quick Summary:
| NF | Eliminates |
|----|-----------|
| 1NF | Multi-valued attributes |
| 2NF | Partial dependencies |
| 3NF | Transitive dependencies |
| BCNF | All anomalies from FDs |`,
  },
};

// Generic AI response generator for questions not in the pre-built responses
export function generateAIResponse(subject, question) {
  const subjectData = aiSubjects.find(s => s.id === subject);
  if (!subjectData) return "I couldn't find that subject. Please try again.";

  // Check if we have a pre-built response
  const subjectResponses = aiResponses[subject];
  if (subjectResponses && subjectResponses[question]) {
    return subjectResponses[question];
  }

  // Generate a contextual response
  return `## ${subjectData.name} - AI Tutor Response

Great question! Let me help you understand this concept.

**Question:** ${question}

Based on the ${subjectData.name} curriculum (${subjectData.description}), here's what you need to know:

### Key Points:
1. This is a fundamental concept in ${subjectData.name}
2. Understanding this will help you in both theory and practical applications
3. Let me break it down step by step

### Explanation:
This topic relates to the core principles of ${subjectData.name}. The concept involves understanding how different components interact and work together to solve computational problems efficiently.

### Tips for Better Understanding:
- Review the related lecture notes from ${subjectData.code}
- Practice with examples and try to implement the concept
- Connect this with other topics you've already learned
- Try explaining it to a peer - teaching reinforces learning

### Further Reading:
- Textbook chapters related to ${subjectData.description}
- Online resources and video lectures
- Practice problems on competitive programming platforms

*Would you like me to explain any specific part in more detail?*`;
}
