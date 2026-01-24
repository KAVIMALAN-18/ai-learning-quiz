export const QUIZ_TEMPLATES = [
    {
        id: 't1',
        title: 'React Essentials',
        topic: 'React',
        difficulty: 'Beginner',
        questions: Array(10).fill({}),
        description: 'Master components, props, and state basics.',
        timeLimit: 15
    },
    {
        id: 't2',
        title: 'Advanced JavaScript Patterns',
        topic: 'JavaScript',
        difficulty: 'Advanced',
        questions: Array(15).fill({}),
        description: 'Closures, prototypes, and async architecture.',
        timeLimit: 25
    },
    {
        id: 't3',
        title: 'CSS Flexbox Mastery',
        topic: 'CSS',
        difficulty: 'Intermediate',
        questions: Array(12).fill({}),
        description: 'Build responsive and complex layouts easily.',
        timeLimit: 20
    },
    {
        id: 't4',
        title: 'Node.js Microservices',
        topic: 'Node.js',
        difficulty: 'Intermediate',
        questions: Array(10).fill({}),
        description: 'Scalable backend architecture patterns.',
        timeLimit: 15
    },
    {
        id: 't5',
        title: 'Python for Data Science',
        topic: 'Python',
        difficulty: 'Beginner',
        questions: Array(10).fill({}),
        description: 'Introduction to Pandas and NumPy.',
        timeLimit: 15
    },
    {
        id: 't6',
        title: 'Modern UI/UX Principles',
        topic: 'Design',
        difficulty: 'Beginner',
        questions: Array(8).fill({}),
        description: 'Color theory, typography, and layout.',
        timeLimit: 10
    },
];

export const MOCK_RESULTS = {
    score: 8,
    total: 10,
    timeTaken: 450, // seconds
    accuracy: 80,
    isPass: true,
    topic: "React Essentials",
    difficulty: "Beginner",
    globalAverage: 72,
    avgTimePerQuestion: 45,
    answers: [
        { questionId: 'q0', answer: 0, correct: true, timeSpent: 35 },
        { questionId: 'q1', answer: 1, correct: true, timeSpent: 52 },
        { questionId: 'q2', answer: 2, correct: false, timeSpent: 65 },
        { questionId: 'q3', answer: 0, correct: true, timeSpent: 28 },
        { questionId: 'q4', answer: 4, correct: true, timeSpent: 40 },
        { questionId: 'q5', answer: 2, correct: true, timeSpent: 30 },
        { questionId: 'q6', answer: 1, correct: false, timeSpent: 75 },
        { questionId: 'q7', answer: 3, correct: true, timeSpent: 42 },
        { questionId: 'q8', answer: 2, correct: true, timeSpent: 25 },
        { questionId: 'q9', answer: 0, correct: true, timeSpent: 58 },
    ]
};
