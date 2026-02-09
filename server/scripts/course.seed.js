const mongoose = require('mongoose');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

const coursesData = [
    {
        title: "Python Mastery",
        slug: "python",
        category: "Programming",
        difficulty: "Beginner",
        icon: "Python",
        overview: "Comprehensive Python journey from zero to hero.",
        objectives: ["Basic syntax", "Functions & Modules", "Data Structures", "OOP"],
        modules: [
            {
                title: "Python Fundamentals",
                topics: [
                    {
                        title: "Variables & Data Types",
                        explanation: "Variables in Python are dynamically typed...",
                        examples: [{ language: "python", code: "name = 'Python'\nage = 30", description: "Variables" }]
                    }
                ]
            }
        ]
    },
    {
        title: "Java Professional",
        slug: "java",
        category: "Programming",
        difficulty: "Intermediate",
        icon: "Java",
        overview: "Master Java and build enterprise-grade applications.",
        objectives: ["JVM internals", "Multithreading", "Memory Management"],
        modules: [
            {
                title: "Java Basics",
                topics: [
                    {
                        title: "Classes & Objects",
                        explanation: "Java is a purely object-oriented language...",
                        examples: [{ language: "java", code: "public class Main { }", description: "Simple Class" }]
                    }
                ]
            }
        ]
    },
    { title: "C Programming", slug: "c", category: "Programming", difficulty: "Beginner", icon: "Code" },
    { title: "C++ Advanced", slug: "cpp", category: "Programming", difficulty: "Advanced", icon: "Code" },
    { title: "JavaScript Elite", slug: "javascript", category: "Frontend", difficulty: "Intermediate", icon: "Javascript" },
    { title: "Node.js Backend", slug: "nodejs", category: "Backend", difficulty: "Intermediate", icon: "Server" },
    { title: "Django Fullstack", slug: "django", category: "Backend", difficulty: "Intermediate", icon: "Globe" },
    { title: "Spring Boot Enterprise", slug: "springboot", category: "Backend", difficulty: "Advanced", icon: "Settings" },
    { title: "SQL Mastery", slug: "sql", category: "Database", difficulty: "Beginner", icon: "Database" },
    { title: "MongoDB Cloud", slug: "mongodb", category: "Database", difficulty: "Intermediate", icon: "Database" },
    { title: "React Modern UI", slug: "react", category: "Frontend", difficulty: "Intermediate", icon: "Layers" },
    { title: "Machine Learning Foundations", slug: "ml", category: "AI/ML", difficulty: "Intermediate", icon: "Brain" },
    { title: "Deep Learning Specialization", slug: "dl", category: "AI/ML", difficulty: "Advanced", icon: "Cpu" },
    { title: "NLP Essentials", slug: "nlp", category: "AI/ML", difficulty: "Advanced", icon: "MessageCircle" },
    { title: "AWS Cloud Architect", slug: "aws", category: "Cloud/DevOps", difficulty: "Advanced", icon: "Cloud" },
    { title: "Docker & Kubernetes", slug: "devops", category: "Cloud/DevOps", difficulty: "Advanced", icon: "Zap" },
    { title: "Flutter Cross-Platform", slug: "flutter", category: "Mobile", difficulty: "Intermediate", icon: "Smartphone" }
];

const seedDB = async () => {
    try {
        // 1. Clear existing data
        await Course.deleteMany({});
        await Module.deleteMany({});
        await Topic.deleteMany({});
        await Quiz.deleteMany({});
        await Question.deleteMany({});

        console.log("Cleared old learning system data.");

        for (const cData of coursesData) {
            // Create Course
            const course = await Course.create({
                title: cData.title,
                slug: cData.slug,
                category: cData.category,
                difficulty: cData.difficulty,
                icon: cData.icon,
                overview: cData.overview || "Professional course content by AI Learning Platform.",
                objectives: cData.objectives || ["Practical skills", "Theory", "Build real project"],
                isActive: true
            });

            // Create dummy module and topics if they exist in cData
            if (cData.modules) {
                for (const mData of cData.modules) {
                    const module = await Module.create({
                        title: mData.title,
                        courseId: course._id
                    });

                    for (const tData of mData.topics) {
                        const topic = await Topic.create({
                            title: tData.title,
                            slug: tData.title.toLowerCase().replace(/ /g, '-'),
                            explanation: tData.explanation,
                            examples: tData.examples,
                            moduleId: module._id
                        });
                        module.topics.push(topic._id);
                    }
                    await module.save();
                    course.modules.push(module._id);
                }
            } else {
                // Default module for other courses
                const module = await Module.create({ title: "Module 1: Basics", courseId: course._id });
                const topic = await Topic.create({
                    title: "Getting Started",
                    slug: "getting-started",
                    explanation: `Welcome to the ${cData.title} course!`,
                    moduleId: module._id
                });
                module.topics.push(topic._id);
                await module.save();
                course.modules.push(module._id);
            }

            course.totalModules = course.modules.length;
            await course.save();
            console.log(`Created course: ${course.title}`);
        }

        console.log("✅ All courses seeded successfully!");
    } catch (err) {
        console.error("❌ Seed failed:", err);
    }
};

// Check if run directly
if (require.main === module) {
    require('dotenv').config();
    mongoose.connect(process.env.MONGO_URI)
        .then(() => seedDB().then(() => mongoose.connection.close()))
        .catch(err => console.error(err));
}

module.exports = seedDB;
