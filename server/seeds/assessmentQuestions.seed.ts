export interface SeedQuestion {
  id: string;
  skillSlug: string;
  skillName: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

export const QUESTION_BANK: SeedQuestion[] = [
  // ==========================================
  // JAVASCRIPT QUESTIONS (skillSlug: javascript)
  // ==========================================
  {
    id: 'q-js-1',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'What does Array.prototype.map() return when called on an array?',
    options: [
      'A new array containing the results of calling the callback on every element',
      'The original array mutated in place',
      'A single accumulated value calculated by the callback function',
      'A boolean indicating whether all elements match the condition',
    ],
    correctAnswer: 'A new array containing the results of calling the callback on every element',
    difficulty: 'beginner',
    explanation: 'map() creates a new array populated with the results of calling a provided function on every element in the calling array without mutating the original array.',
  },
  {
    id: 'q-js-2',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'What is the output of `typeof null` in JavaScript?',
    options: ['"null"', '"object"', '"undefined"', '"symbol"'],
    correctAnswer: '"object"',
    difficulty: 'beginner',
    explanation: '`typeof null` returning `"object"` is a legacy bug in JavaScript dating back to its initial 1995 implementation where values were represented with type tags.',
  },
  {
    id: 'q-js-3',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'Which keyword creates a block-scoped variable that cannot be re-declared in the same scope?',
    options: ['var', 'let', 'global', 'dynamic'],
    correctAnswer: 'let',
    difficulty: 'beginner',
    explanation: '`let` declares block-scoped local variables. Unlike `var`, `let` variables are not hoisted with initialization and cannot be re-declared within the same block.',
  },
  {
    id: 'q-js-4',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'What is a closure in JavaScript?',
    options: [
      'A function combined with references to its surrounding lexical environment',
      'A method used to immediately terminate an execution context',
      'A syntax structure for closing database connections automatically',
      'An object property that cannot be modified after instantiation',
    ],
    correctAnswer: 'A function combined with references to its surrounding lexical environment',
    difficulty: 'intermediate',
    explanation: 'A closure gives a inner function access to an outer function\'s scope variables even after the outer function has finished executing.',
  },
  {
    id: 'q-js-5',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'What does the Event Loop do in JavaScript execution runtime?',
    options: [
      'Executes multiple threads simultaneously across CPU cores',
      'Monitors the Call Stack and Callback Queue, pushing queued callbacks to the stack when empty',
      'Compiles JavaScript code directly to machine language instructions',
      'Manages garbage collection for unreferenced heap objects',
    ],
    correctAnswer: 'Monitors the Call Stack and Callback Queue, pushing queued callbacks to the stack when empty',
    difficulty: 'intermediate',
    explanation: 'The Event Loop handles asynchronous callbacks by continuously checking if the call stack is empty before moving tasks from the queue to the stack.',
  },
  {
    id: 'q-js-6',
    skillSlug: 'javascript',
    skillName: 'JavaScript',
    questionText: 'What happens when `Promise.all([p1, p2, p3])` is executed and `p2` rejects?',
    options: [
      'The resulting promise immediately rejects with p2\'s rejection reason',
      'It waits for p1 and p3 to resolve, returning an array with undefined for p2',
      'It retries p2 up to 3 times before throwing an unhandled exception',
      'It returns a fulfilled promise containing an error object in p2\'s position',
    ],
    correctAnswer: 'The resulting promise immediately rejects with p2\'s rejection reason',
    difficulty: 'advanced',
    explanation: '`Promise.all` follows a fail-fast behavior: if any input promise rejects, the returned promise immediately rejects with that reason.',
  },

  // ==========================================
  // REACT QUESTIONS (skillSlug: react)
  // ==========================================
  {
    id: 'q-react-1',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'What is the main purpose of React\'s Virtual DOM?',
    options: [
      'To directly modify browser DOM nodes faster using C++ bindings',
      'To minimize actual DOM manipulation by computing diffs in memory before batching updates',
      'To bypass HTML security restrictions in modern browsers',
      'To store client-side user sessions in localStorage',
    ],
    correctAnswer: 'To minimize actual DOM manipulation by computing diffs in memory before batching updates',
    difficulty: 'beginner',
    explanation: 'React maintains an in-memory Virtual DOM representation, diffing it against current state changes (reconciliation) to batch efficient real DOM updates.',
  },
  {
    id: 'q-react-2',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'What is the correct rule when calling React Hooks inside a functional component?',
    options: [
      'Hooks can only be called inside nested for loops',
      'Hooks must only be called at the top level of the component function',
      'Hooks must be called inside conditional if blocks to prevent memory leaks',
      'Hooks can only be declared inside asynchronous handler functions',
    ],
    correctAnswer: 'Hooks must only be called at the top level of the component function',
    difficulty: 'beginner',
    explanation: 'Hooks rely on call order consistency across renders. They must not be called inside loops, conditions, or nested functions.',
  },
  {
    id: 'q-react-3',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'How do you pass data down from a parent component to a child component in React?',
    options: ['Via props', 'Via Redux actions only', 'Via global window variables', 'Via CSS selectors'],
    correctAnswer: 'Via props',
    difficulty: 'beginner',
    explanation: 'Props (short for properties) are unidirectional read-only arguments passed from parent components to child components.',
  },
  {
    id: 'q-react-4',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'What does passing an empty dependency array `[]` to `useEffect` accomplish?',
    options: [
      'The effect runs on every single component render',
      'The effect runs only once after the initial component mount',
      'The effect never runs under any circumstances',
      'The effect runs only when component props change',
    ],
    correctAnswer: 'The effect runs only once after the initial component mount',
    difficulty: 'intermediate',
    explanation: 'An empty dependency array `[]` tells React that the effect does not depend on any state or props, so it executes once after initial mounting.',
  },
  {
    id: 'q-react-5',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'Why should you pass a unique `key` prop when rendering lists of elements in React?',
    options: [
      'To style list items with unique CSS IDs automatically',
      'To help React identify which items have changed, been added, or removed during re-renders',
      'To prevent memory leaks when binding click event handlers',
      'To make list items accessible to screen readers',
    ],
    correctAnswer: 'To help React identify which items have changed, been added, or removed during re-renders',
    difficulty: 'intermediate',
    explanation: 'Keys give elements a stable identity, allowing React to optimize list reconciliation and preserve state correctly.',
  },
  {
    id: 'q-react-6',
    skillSlug: 'react',
    skillName: 'React',
    questionText: 'What is the primary benefit of `useMemo` in React component optimization?',
    options: [
      'To cache expensive calculation results between renders unless dependencies change',
      'To automatically memoize all component render outputs',
      'To execute side effects asynchronously off the main thread',
      'To convert class components to functional components automatically',
    ],
    correctAnswer: 'To cache expensive calculation results between renders unless dependencies change',
    difficulty: 'advanced',
    explanation: '`useMemo` caches the result of a calculation between renders, recomputing it only when one of its specified dependencies changes.',
  },

  // ==========================================
  // NODE.JS QUESTIONS (skillSlug: nodejs)
  // ==========================================
  {
    id: 'q-node-1',
    skillSlug: 'nodejs',
    skillName: 'Node.js',
    questionText: 'What non-blocking I/O library powers the asynchronous Event Loop in Node.js?',
    options: ['libuv', 'V8', 'boost', 'openssl'],
    correctAnswer: 'libuv',
    difficulty: 'beginner',
    explanation: 'libuv is a C library that provides Node.js with asynchronous I/O capabilities, thread pool management, and event loop handling across operating systems.',
  },
  {
    id: 'q-node-2',
    skillSlug: 'nodejs',
    skillName: 'Node.js',
    questionText: 'In Express.js, what parameter signature distinguishes an error-handling middleware?',
    options: ['(req, res)', '(err, req, res, next)', '(req, res, err)', '(next, err)'],
    correctAnswer: '(err, req, res, next)',
    difficulty: 'intermediate',
    explanation: 'Express recognizes error-handling middleware by taking exactly 4 arguments: `(err, req, res, next)`.',
  },
  {
    id: 'q-node-3',
    skillSlug: 'nodejs',
    skillName: 'Node.js',
    questionText: 'What is the difference between `process.nextTick()` and `setImmediate()` in Node.js?',
    options: [
      '`process.nextTick()` executes immediately after the current operation before the event loop continues; `setImmediate()` runs on the next check phase',
      '`setImmediate()` runs before promises resolve; `process.nextTick()` runs after timer expiration',
      'They are identical aliases for scheduling microtasks',
      '`process.nextTick()` creates a background worker thread; `setImmediate()` runs synchronously',
    ],
    correctAnswer: '`process.nextTick()` executes immediately after the current operation before the event loop continues; `setImmediate()` runs on the next check phase',
    difficulty: 'advanced',
    explanation: '`process.nextTick()` fires before the event loop continues to the next phase, whereas `setImmediate()` queues code for execution in the Check phase of the loop.',
  },

  // ==========================================
  // SQL QUESTIONS (skillSlug: sql)
  // ==========================================
  {
    id: 'q-sql-1',
    skillSlug: 'sql',
    skillName: 'SQL',
    questionText: 'Which SQL clause is used to filter records aggregated by a `GROUP BY` clause?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'FILTER'],
    correctAnswer: 'HAVING',
    difficulty: 'beginner',
    explanation: 'The `HAVING` clause filters summary groups created by `GROUP BY`, whereas `WHERE` filters individual rows before grouping occurs.',
  },
  {
    id: 'q-sql-2',
    skillSlug: 'sql',
    skillName: 'SQL',
    questionText: 'What type of join returns all rows from the left table and matched rows from the right table?',
    options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
    correctAnswer: 'LEFT JOIN',
    difficulty: 'beginner',
    explanation: '`LEFT JOIN` (or `LEFT OUTER JOIN`) preserves all rows from the left table, filling unmatched right table columns with `NULL`.',
  },
  {
    id: 'q-sql-3',
    skillSlug: 'sql',
    skillName: 'SQL',
    questionText: 'What is database normalization?',
    options: [
      'Structuring relational database tables to reduce data redundancy and improve data integrity',
      'Converting relational tables into JSON documents for NoSQL storage',
      'Encrypting database rows with secret AES keys',
      'Increasing disk read speeds by duplicating table rows across clusters',
    ],
    correctAnswer: 'Structuring relational database tables to reduce data redundancy and improve data integrity',
    difficulty: 'intermediate',
    explanation: 'Database normalization organizes columns and tables to ensure dependencies are properly enforced and redundant data is eliminated.',
  },

  // ==========================================
  // PYTHON QUESTIONS (skillSlug: python)
  // ==========================================
  {
    id: 'q-py-1',
    skillSlug: 'python',
    skillName: 'Python',
    questionText: 'What is the difference between a tuple and a list in Python?',
    options: [
      'Tuples are immutable; lists are mutable',
      'Lists can store strings; tuples can only store numbers',
      'Tuples use curly braces {}; lists use parentheses ()',
      'Lists are faster than tuples for read-only lookups',
    ],
    correctAnswer: 'Tuples are immutable; lists are mutable',
    difficulty: 'beginner',
    explanation: 'Tuples are immutable sequences whose elements cannot be modified after creation, whereas lists can be modified in place.',
  },
  {
    id: 'q-py-2',
    skillSlug: 'python',
    skillName: 'Python',
    questionText: 'What does a list comprehension like `[x**2 for x in range(5)]` evaluate to?',
    options: ['[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', '(0, 1, 4, 9, 16)', '25'],
    correctAnswer: '[0, 1, 4, 9, 16]',
    difficulty: 'intermediate',
    explanation: '`range(5)` yields 0, 1, 2, 3, 4. Squaring each yields `[0, 1, 4, 9, 16]`.',
  },

  // ==========================================
  // GIT QUESTIONS (skillSlug: git)
  // ==========================================
  {
    id: 'q-git-1',
    skillSlug: 'git',
    skillName: 'Git',
    questionText: 'Which Git command creates a new branch and switches to it in a single step?',
    options: ['git checkout -b <branch-name>', 'git branch <branch-name>', 'git merge <branch-name>', 'git commit -m <branch-name>'],
    correctAnswer: 'git checkout -b <branch-name>',
    difficulty: 'beginner',
    explanation: '`git checkout -b <branch-name>` (or `git switch -c <branch-name>`) creates a new branch pointing to HEAD and switches working directory to it.',
  },
  {
    id: 'q-git-2',
    skillSlug: 'git',
    skillName: 'Git',
    questionText: 'What is the main conceptual difference between `git merge` and `git rebase`?',
    options: [
      '`git merge` creates a new merge commit preserving branch history; `git rebase` rewrites history by applying commits on top of another base',
      '`git rebase` uploads code to GitHub; `git merge` stores code locally',
      '`git merge` deletes committed files; `git rebase` restores deleted files',
      'They perform identical operations under different syntax aliases',
    ],
    correctAnswer: '`git merge` creates a new merge commit preserving branch history; `git rebase` rewrites history by applying commits on top of another base',
    difficulty: 'intermediate',
    explanation: 'Merging retains original branch commit structures with a merge commit. Rebasing re-applies topic branch commits onto the tip of the target branch, resulting in a linear history.',
  }
];

export const getQuestionsBySkillSlug = (slug: string): SeedQuestion[] => {
  return QUESTION_BANK.filter(
    (q) => q.skillSlug.toLowerCase() === slug.toLowerCase()
  );
};
