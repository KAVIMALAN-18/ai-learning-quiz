const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Course = require('../models/Course');
const Module = require('../models/Module');
const Topic = require('../models/Topic');

const standardCourses = [
    { id: 'python', title: 'Python Programming', category: 'Programming', difficulty: 'Beginner', time: '40 hours', icon: 'python', thumb: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80', tags: ['Python', 'Automation', 'Data Science'] },
    { id: 'java', title: 'Java Programming', category: 'Programming', difficulty: 'Beginner', time: '45 hours', icon: 'coffee', thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', tags: ['Java', 'OOP', 'Enterprise'] },
    { id: 'cpp', title: 'C / C++ Programming', category: 'Programming', difficulty: 'Intermediate', time: '50 hours', icon: 'terminal', thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', tags: ['C++', 'Systems', 'Performance'] },
    { id: 'javascript', title: 'JavaScript Essentials', category: 'Programming', difficulty: 'Beginner', time: '35 hours', icon: 'code', thumb: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80', tags: ['JS', 'Web', 'ES6+'] },
    { id: 'nodejs', title: 'Node.js Backend', category: 'Backend', difficulty: 'Intermediate', time: '40 hours', icon: 'server', thumb: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80', tags: ['Node.js', 'Express', 'API'] },
    { id: 'django', title: 'Django Web Framework', category: 'Backend', difficulty: 'Intermediate', time: '40 hours', icon: 'layout', thumb: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80', tags: ['Django', 'Python', 'Web'] },
    { id: 'springboot', title: 'Spring Boot Microservices', category: 'Backend', difficulty: 'Advanced', time: '55 hours', icon: 'layers', thumb: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', tags: ['Spring', 'Java', 'Microservices'] },
    { id: 'sql', title: 'SQL & Database Design', category: 'Database', difficulty: 'Beginner', time: '30 hours', icon: 'database', thumb: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80', tags: ['SQL', 'PostgreSQL', 'DB Design'] },
    { id: 'mongodb', title: 'MongoDB NoSQL', category: 'Database', difficulty: 'Intermediate', time: '30 hours', icon: 'database', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', tags: ['NoSQL', 'MongoDB', 'Mongoose'] },
    { id: 'react', title: 'React Frontend', category: 'Frontend', difficulty: 'Intermediate', time: '45 hours', icon: 'smartphone', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', tags: ['React', 'Hooks', 'Redux'] },
    { id: 'ml', title: 'Machine Learning', category: 'AI/ML', difficulty: 'Advanced', time: '60 hours', icon: 'cpu', thumb: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80', tags: ['ML', 'Python', 'AI'] },
    { id: 'dl', title: 'Deep Learning', category: 'AI/ML', difficulty: 'Advanced', time: '70 hours', icon: 'brain', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', tags: ['DL', 'Neural Nets', 'AI'] },
    { id: 'nlp', title: 'Natural Language Processing', category: 'AI/ML', difficulty: 'Advanced', time: '55 hours', icon: 'message-square', thumb: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', tags: ['NLP', 'Transformers', 'AI'] },
    { id: 'aws', title: 'AWS Cloud', category: 'Cloud/DevOps', difficulty: 'Intermediate', time: '50 hours', icon: 'cloud', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', tags: ['AWS', 'Cloud', 'Infrastructure'] },
    { id: 'docker', title: 'Docker & Kubernetes', category: 'Cloud/DevOps', difficulty: 'Advanced', time: '45 hours', icon: 'box', thumb: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80', tags: ['Docker', 'K8s', 'DevOps'] },
    { id: 'flutter', title: 'Flutter Mobile', category: 'Mobile', difficulty: 'Intermediate', time: '50 hours', icon: 'smartphone', thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', tags: ['Flutter', 'Dart', 'Mobile'] }
];

const seedLearningSystem = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        console.log("Seeding Learning System...");

        // Clear existing data
        await Course.deleteMany({});
        await Module.deleteMany({});
        await Topic.deleteMany({});

        for (const item of standardCourses) {
            const course = await Course.create({
                title: item.title,
                slug: item.id,
                description: `Professional technical course exploring ${item.title} with industrial use-cases and structured milestones.`,
                category: item.category,
                thumbnail: item.thumb,
                difficulty: item.difficulty,
                estimatedTime: item.time,
                icon: item.icon,
                tags: item.tags,
                enrollmentCount: Math.floor(Math.random() * 2000) + 500,
                totalModules: 3,
                totalTopics: 9
            });

            for (let m = 1; m <= 3; m++) {
                const module = await Module.create({
                    title: `Module ${m}: Core ${item.title}`,
                    courseId: course._id,
                    order: m
                });

                for (let t = 1; t <= 3; t++) {
                    const topic = await Topic.create({
                        title: `${item.title} Topic ${m}.${t}`,
                        slug: `${item.id}-m${m}-t${t}`,
                        explanation: `Comprehensive walkthrough of ${item.title} key concepts for Unit ${m}.${t}. This topic covers architecture, syntax, and memory models used in production environments.`,
                        moduleId: module._id,
                        order: t,
                        examples: [
                            {
                                language: item.id === 'python' ? 'python' : 'javascript',
                                code: `// Demonstration for ${item.title}\nconst study = () => console.log("${item.title} Mastery");\nstudy();`,
                                description: `Example implementation of ${item.title} unit ${m}.${t}`
                            }
                        ],
                        practiceQuestions: [
                            {
                                question: `What is the primary benefit of using ${item.title} in industrial projects?`,
                                options: ["Scalability", "Readability", "Portability", "Efficiency"],
                                correctAnswer: 0,
                                explanation: `${item.title} is favored for its robust scaling capabilities and ecosystem support.`
                            },
                            {
                                question: `Which version of ${item.title} introduced standardized modules?`,
                                options: ["Legacy", "Initial", "Modern", "Custom"],
                                correctAnswer: 2,
                                explanation: "Standardization moved significantly forward in the modern versions."
                            }
                        ]
                    });
                    await Module.findByIdAndUpdate(module._id, { $push: { topics: topic._id } });
                }
                await Course.findByIdAndUpdate(course._id, { $push: { modules: module._id } });
            }
            console.log(`- Seeded: ${item.title}`);
        }

        console.log("✅ Seeding completed successfully!");
        return true;
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        return false;
    }
};

if (require.main === module) {
    seedLearningSystem().then(() => process.exit(0));
}

module.exports = seedLearningSystem;
