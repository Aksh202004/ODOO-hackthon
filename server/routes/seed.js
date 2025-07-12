const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Tag = require('../models/Tag');

router.post('/', async (req, res) => {
  try {
    // Clear existing data
    await Answer.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    await Tag.deleteMany({});

    // Create users
    const users = await User.create([
      { username: 'john_doe', email: 'john.doe@example.com', password: 'password123', role: 'user' },
      { username: 'jane_smith', email: 'jane.smith@example.com', password: 'password123', role: 'user' },
      { username: 'css_expert', email: 'css.expert@example.com', password: 'password123', role: 'admin' },
      { username: 'react_guru', email: 'react.guru@example.com', password: 'password123', role: 'user' },
      { username: 'ts_pro', email: 'ts.pro@example.com', password: 'password123', role: 'user' },
    ]);

    // Create tags
    const tags = await Tag.create([
      { name: 'css', description: 'Cascading Style Sheets' },
      { name: 'html', description: 'HyperText Markup Language' },
      { name: 'flexbox', description: 'CSS Flexible Box Layout' },
      { name: 'javascript', description: 'A programming language' },
      { name: 'react', description: 'A JavaScript library for building user interfaces' },
      { name: 'next.js', description: 'The React Framework for Production' },
      { name: 'typescript', description: 'A typed superset of JavaScript' },
      { name: 'performance', description: 'Techniques for optimizing web performance' },
      { name: 'grid', description: 'CSS Grid Layout' },
    ]);

    // --- Question 1 ---
    const q1 = await Question.create({
      title: 'How to center a div in CSS?',
      description: "I've been trying to center a div both horizontally and vertically but can't seem to get it right. I've tried using flexbox but it's not working as expected.\n\nHere's my current CSS:\n```css\n.container {\n  display: flex;\n  height: 100vh;\n}\n\n.centered {\n  margin: auto;\n}\n```\nBut the div is not centering properly. What am I missing?",
      author: users[0]._id,
      tags: [tags[0]._id, tags[2]._id],
      votes: {
        upvotes: [
          { user: users[1]._id },
          { user: users[2]._id },
          { user: users[3]._id },
          { user: users[4]._id },
        ],
      },
    });
    const a1 = await Answer.create({
      content: "The issue with your code is that you need to set `justify-content` and `align-items` properties on the flex container. Here's the correct way:\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n```\nThis will center the div both horizontally and vertically.",
      author: users[2]._id,
      question: q1._id,
      isAccepted: true,
      votes: { upvotes: [{ user: users[0]._id }, { user: users[1]._id }], downvotes: [] },
    });
    console.log(`Question 1 created with ID: ${q1._id}`);
    console.log(`Answer 1 created with ID: ${a1._id}`);
    await Question.findByIdAndUpdate(q1._id, { $push: { answers: a1._id } });
    const updatedQ1 = await Question.findById(q1._id);
    console.log(`Updated Question 1 answers: ${updatedQ1.answers}`);

    // --- Question 2 ---
    const q2 = await Question.create({
      title: 'What is the difference between React and Next.js?',
      description: "I'm new to the React ecosystem and I'm confused about the difference between Create React App and Next.js. When should I use one over the other? What are the key advantages of Next.js?",
      author: users[1]._id,
      tags: [tags[4]._id, tags[5]._id],
      votes: {
        upvotes: [{ user: users[0]._id }, { user: users[2]._id }, { user: users[3]._id }],
        downvotes: [{ user: users[4]._id }],
      },
    });
    const a2 = await Answer.create({
      content: "Next.js is a framework built on top of React. It provides features like server-side rendering (SSR), static site generation (SSG), file-based routing, and API routes out of the box. Create React App is a tool to set up a client-side React application quickly.\n\nUse Next.js when you need SEO, better performance, or a full-stack application. Use Create React App for simpler client-side applications.",
      author: users[3]._id,
      question: q2._id,
      isAccepted: true,
      votes: { upvotes: [{ user: users[0]._id }], downvotes: [] },
    });
    console.log(`Question 2 created with ID: ${q2._id}`);
    console.log(`Answer 2 created with ID: ${a2._id}`);
    await Question.findByIdAndUpdate(q2._id, { $push: { answers: a2._id } });
    const updatedQ2 = await Question.findById(q2._id);
    console.log(`Updated Question 2 answers: ${updatedQ2.answers}`);

    // --- Question 3 ---
    const q3 = await Question.create({
      title: 'How to optimize React performance?',
      description: "My React application is becoming slow as it grows. What are the best practices for optimizing the performance of a React application? I've heard about memoization and code splitting, but I'm not sure how to implement them effectively.",
      author: users[0]._id,
      tags: [tags[4]._id, tags[7]._id],
      votes: {
        upvotes: [{ user: users[1]._id }, { user: users[2]._id }, { user: users[3]._id }, { user: users[4]._id }],
        downvotes: [{ user: users[1]._id }, { user: users[2]._id }],
      },
    });
    const a3 = await Answer.create({
      content: "Key strategies include:\n1.  **`React.memo`**: For memoizing functional components.\n2.  **`useMemo` and `useCallback`**: For memoizing values and functions.\n3.  **Code Splitting with `React.lazy` and `Suspense`**: To load components only when they are needed.\n4.  **Windowing libraries like `react-window`**: For rendering large lists efficiently.",
      author: users[3]._id,
      question: q3._id,
      votes: { upvotes: [{ user: users[1]._id }], downvotes: [] },
    });
    console.log(`Question 3 created with ID: ${q3._id}`);
    console.log(`Answer 3 created with ID: ${a3._id}`);
    await Question.findByIdAndUpdate(q3._id, { $push: { answers: a3._id } });
    const updatedQ3 = await Question.findById(q3._id);
    console.log(`Updated Question 3 answers: ${updatedQ3.answers}`);

    // --- Question 4 ---
    const q4 = await Question.create({
      title: 'Best practices for TypeScript?',
      description: "I'm starting a new project with TypeScript and I want to follow the best practices. What are some of the most important things to keep in mind when writing TypeScript code? Are there any common pitfalls to avoid?",
      author: users[1]._id,
      tags: [tags[6]._id],
      votes: {
        upvotes: [{ user: users[0]._id }, { user: users[2]._id }, { user: users[4]._id }],
      },
    });
    const a4 = await Answer.create({
      content: "1.  **Enable `strict` mode** in your `tsconfig.json`.\n2.  **Avoid using the `any` type** whenever possible. Use `unknown` instead for better type safety.\n3.  **Use utility types** like `Partial`, `Pick`, and `Omit` to create new types from existing ones.\n4.  **Prefer interfaces over types for public APIs** and object shapes, but use types for unions, intersections, and primitives.",
      author: users[4]._id,
      question: q4._id,
      isAccepted: true,
      votes: { upvotes: [{ user: users[0]._id }, { user: users[2]._id }], downvotes: [] },
    });
    console.log(`Question 4 created with ID: ${q4._id}`);
    console.log(`Answer 4 created with ID: ${a4._id}`);
    await Question.findByIdAndUpdate(q4._id, { $push: { answers: a4._id } });
    const updatedQ4 = await Question.findById(q4._id);
    console.log(`Updated Question 4 answers: ${updatedQ4.answers}`);

    // --- Question 5 ---
    const q5 = await Question.create({
      title: 'CSS Grid vs Flexbox: when to use?',
      description: "I'm not sure when to use CSS Grid and when to use Flexbox. They both seem to be able to create complex layouts. What are the main differences between them and what are the use cases for each?",
      author: users[2]._id,
      tags: [tags[0]._id, tags[2]._id, tags[8]._id],
      votes: {
        upvotes: [{ user: users[0]._id }, { user: users[1]._id }, { user: users[3]._id }],
      },
    });
    const a5 = await Answer.create({
      content: "The simple rule of thumb is:\n- **Flexbox** is for one-dimensional layouts (a row or a column).\n- **Grid** is for two-dimensional layouts (rows and columns).\n\nIf you're aligning items in a single line, Flexbox is usually the right choice. If you need to create a complex grid with rows and columns, Grid is the way to go.",
      author: users[2]._id,
      question: q5._id,
      votes: { upvotes: [{ user: users[0]._id }], downvotes: [] },
    });
    console.log(`Question 5 created with ID: ${q5._id}`);
    console.log(`Answer 5 created with ID: ${a5._id}`);
    await Question.findByIdAndUpdate(q5._id, { $push: { answers: a5._id } });
    const updatedQ5 = await Question.findById(q5._id);
    console.log(`Updated Question 5 answers: ${updatedQ5.answers}`);

    // --- Question 6 ---
    const q6 = await Question.create({
      title: 'How to handle async operations in Redux?',
      description: "What is the standard way to handle asynchronous actions, like API calls, in a Redux application? I've seen middleware like Thunk and Saga being mentioned.",
      author: users[3]._id,
      tags: [tags[4]._id],
      votes: {
        upvotes: [{ user: users[0]._id }, { user: users[1]._id }, { user: users[2]._id }],
        downvotes: [{ user: users[4]._id }],
      },
    });
    const a6 = await Answer.create({
      content: "The most common approaches are:\n- **Redux Thunk**: A middleware that allows you to write action creators that return a function instead of an action. This function receives the store's `dispatch` and `getState` methods as arguments and can be used to perform async logic.\n- **Redux Saga**: A more advanced middleware that uses ES6 Generators to make async flows easy to read, write, and test.\n\nFor most use cases, **Redux Toolkit's `createAsyncThunk`** is the recommended modern approach, as it simplifies the process significantly.",
      author: users[4]._id,
      question: q6._id,
      votes: { upvotes: [], downvotes: [] },
    });
    console.log(`Question 6 created with ID: ${q6._id}`);
    console.log(`Answer 6 created with ID: ${a6._id}`);
    await Question.findByIdAndUpdate(q6._id, { $push: { answers: a6._id } });
    const updatedQ6 = await Question.findById(q6._id);
    console.log(`Updated Question 6 answers: ${updatedQ6.answers}`);

    res.status(201).json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during seeding',
    });
  }
});

module.exports = router;
