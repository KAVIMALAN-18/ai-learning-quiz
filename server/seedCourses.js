const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
const mongoose = require('mongoose');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing
        await Course.deleteMany({});
        await Module.deleteMany({});
        await Lesson.deleteMany({});

        // 1. C LANGUAGE COURSE
        const cCourse = await Course.create({
            title: "C Programming Masterclass",
            slug: "c-language",
            description: "Master the foundation of modern computing with C. Learn memory management, pointers, and systems programming.",
            difficulty: "Beginner",
            estimatedTime: "15 Hours",
            thumbnail: "https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&q=80&w=300"
        });

        // Module 1: Introduction
        const m1 = await Module.create({
            title: "Module 1: Introduction to C",
            courseId: cCourse._id,
            order: 1
        });

        const l1 = await Lesson.create({
            title: "History and Evolution of C",
            slug: "history-of-c",
            moduleId: m1._id,
            order: 1,
            content: `
# History of C
C was developed by **Dennis Ritchie** at Bell Labs between 1972 and 1973. It was designed to build the UNIX operating system.

### Why learn C?
- Foundation of modern OS (Linux, Windows)
- Extremely fast and efficient
- Low-level memory access
- Portable across different hardware
            `,
            codeSnippets: [{
                language: "c",
                label: "Classic C Program",
                code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, LearnSphere!");\n    return 0;\n}'
            }],
            resources: [
                { title: "Ritchie's Original C Paper", url: "https://bell-labs.com/usr/dmr/www/chist.html", type: "Doc" }
            ],
            quiz: [{
                question: "Who developed the C programming language?",
                options: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"],
                correctAnswer: 1,
                explanation: "Dennis Ritchie developed C at Bell Labs in the early 1970s."
            }]
        });

        m1.lessons.push(l1._id);
        await m1.save();

        cCourse.modules.push(m1._id);
        await cCourse.save();

        // 2. PYTHON COURSE
        const pyCourse = await Course.create({
            title: "Python for Data Science",
            slug: "python",
            description: "Learn Python from scratch. Transition from basics to powerful data analysis libraries like Pandas and NumPy.",
            difficulty: "Beginner",
            estimatedTime: "12 Hours",
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300"
        });

        const pm1 = await Module.create({
            title: "Module 1: Getting Started",
            courseId: pyCourse._id,
            order: 1
        });

        const pl1 = await Lesson.create({
            title: "Python Setup & Hello World",
            slug: "python-setup",
            moduleId: pm1._id,
            order: 1,
            content: `
# Welcome to Python
Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability.

### Key Features:
- Easy to learn and read
- Massive ecosystem of libraries
- Interpreted (no explicit compilation)
- Dynamically typed
            `,
            codeSnippets: [{
                language: "python",
                label: "Python Basics",
                code: 'print("Hello, Python World!")\n\nname = "LearnSphere"\nprint(f"Welcome to {name}")'
            }],
            resources: [
                { title: "Official Python Docs", url: "https://docs.python.org/3/", type: "Doc" }
            ],
            quiz: [{
                question: "Is Python an interpreted language?",
                options: ["Yes", "No"],
                correctAnswer: 0,
                explanation: "Python is an interpreted language, meaning the code is executed line by line."
            }]
        });

        pm1.lessons.push(pl1._id);
        await pm1.save();
        pyCourse.modules.push(pm1._id);
        await pyCourse.save();

        // 3. REACT COURSE
        const reactCourse = await Course.create({
            title: "Fullstack React Ecosystem",
            slug: "react",
            description: "Build modern web applications with React. Master Hooks, Context API, and integration with modern backends.",
            difficulty: "Intermediate",
            estimatedTime: "20 Hours",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300"
        });

        const rm1 = await Module.create({
            title: "Module 1: Foundation",
            courseId: reactCourse._id,
            order: 1
        });

        const rl1 = await Lesson.create({
            title: "Introduction to Hooks",
            slug: "react-hooks-intro",
            moduleId: rm1._id,
            order: 1,
            content: `
# React Hooks
Hooks allow you to use state and other React features without writing a class.

### Popular Hooks:
- **useState**: For managing local state
- **useEffect**: For side effects
- **useContext**: For consuming context
- **useMemo**: For performance optimization
            `,
            codeSnippets: [{
                language: "javascript",
                label: "useState Example",
                code: 'import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}'
            }],
            resources: [
                { title: "React Hooks Official Guide", url: "https://react.dev/reference/react", type: "Link" }
            ]
        });

        rm1.lessons.push(rl1._id);
        await rm1.save();
        reactCourse.modules.push(rm1._id);
        await reactCourse.save();

        // 4. SOFT SKILLS COURSE
        const softCourse = await Course.create({
            title: "Corporate Soft Skills",
            slug: "soft-skills",
            description: "Master communication, leadership, and time management necessary for high-performance corporate environments.",
            difficulty: "Beginner",
            estimatedTime: "8 Hours",
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300"
        });

        const sm1 = await Module.create({ title: "Module 1: Professional Communication", courseId: softCourse._id, order: 1 });
        const sl1 = await Lesson.create({
            title: "Art of Verbal Communication",
            slug: "verbal-comm",
            moduleId: sm1._id,
            order: 1,
            content: "Learn how to articulate ideas clearly and confidently in professional meetings."
        });
        sm1.lessons.push(sl1._id);
        await sm1.save();
        softCourse.modules.push(sm1._id);
        await softCourse.save();

        // 5. GOOGLE PREP PATH
        const googleCourse = await Course.create({
            title: "Google Interview Prep Path",
            slug: "google-path",
            description: "Targeted preparation for Google engineering roles focus on Advanced DSA and System Design.",
            difficulty: "Advanced",
            estimatedTime: "40 Hours",
            thumbnail: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=300"
        });

        const gm1 = await Module.create({ title: "Module 1: Advanced Algorithms", courseId: googleCourse._id, order: 1 });
        const gl1 = await Lesson.create({
            title: "Dynamic Programming Masterclass",
            slug: "dp-masterclass",
            moduleId: gm1._id,
            order: 1,
            content: "Deep dive into DP patterns frequently asked in Google interviews."
        });
        gm1.lessons.push(gl1._id);
        await gm1.save();
        googleCourse.modules.push(gm1._id);
        await googleCourse.save();

        console.log("✅ All Courses & Paths Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
};

seedData();
