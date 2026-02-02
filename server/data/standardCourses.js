const standardCourses = [
    {
        title: "Python Programming",
        slug: "python-programming",
        category: "Programming",
        difficulty: "Beginner",
        estimatedTime: "20 hours",
        description: "Master Python from basics to advanced concepts with real-world examples.",
        modules: [
            {
                title: "Getting Started with Python",
                topics: [
                    {
                        title: "Introduction to Python",
                        slug: "intro-to-python",
                        explanation: "Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Its language constructs as well as its object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects.",
                        examples: [
                            {
                                language: "python",
                                code: "print('Hello, World!')",
                                description: "The classic hello world program."
                            }
                        ],
                        practiceQuestions: [
                            {
                                question: "Is Python a compiled or interpreted language?",
                                options: ["Compiled", "Interpreted", "Both", "None"],
                                correctAnswer: 1,
                                explanation: "Python is an interpreted language, meaning the code is executed line by line."
                            }
                        ]
                    },
                    {
                        title: "Variables and Data Types",
                        slug: "variables-datatypes",
                        explanation: "Variables are containers for storing data values. Python has several standard data types including numeric (int, float, complex), sequence (string, list, tuple), mapping (dict), and set types.",
                        examples: [
                            {
                                language: "python",
                                code: "name = 'Antigravity'\nage = 5\nheight = 1.75\nitems = ['A', 'B', 'C']",
                                description: "Defining variables of different types."
                            }
                        ],
                        practiceQuestions: [
                            {
                                question: "Which of the following is an immutable data type in Python?",
                                options: ["List", "Dictionary", "Tuple", "Set"],
                                correctAnswer: 2,
                                explanation: "Tuples are immutable, meaning their content cannot be changed after creation."
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "JavaScript Essentials",
        slug: "javascript-essentials",
        category: "Programming",
        difficulty: "Beginner",
        estimatedTime: "15 hours",
        description: "Learn the core concepts of JavaScript for modern web development.",
        modules: [
            {
                title: "JavaScript Basics",
                topics: [
                    {
                        title: "Intro to JS",
                        slug: "intro-to-js",
                        explanation: "JavaScript is a scripting language that enables you to create dynamically updating content, control multimedia, animate images, and pretty much everything else. (Okay, not everything, but it is amazing what you can achieve with a few lines of JavaScript code.)",
                        examples: [
                            {
                                language: "javascript",
                                code: "console.log('Hello from JS!');",
                                description: "Logging a message to the console."
                            }
                        ],
                        practiceQuestions: [
                            {
                                question: "Where can JavaScript be executed?",
                                options: ["Browser only", "Server only", "Both Browser and Server", "None"],
                                correctAnswer: 2,
                                explanation: "JavaScript can run in the browser and on the server (using Node.js)."
                            }
                        ]
                    }
                ]
            }
        ]
    }
    // ... more courses will be added via the seeder logic to keep the file size manageable
];

module.exports = standardCourses;
