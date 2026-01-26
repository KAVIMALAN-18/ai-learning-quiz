const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Generate certificate after quiz completion
exports.generateCertificate = async (req, res) => {
    try {
        const { quizId, score } = req.body;
        const userId = req.user.id;

        // Validate minimum score (60% to pass)
        if (score < 60) {
            return res.status(400).json({
                message: 'Score too low for certificate. Minimum 60% required.'
            });
        }

        // Check if certificate already exists for this quiz
        const existingCert = await Certificate.findOne({ userId, quizId });
        if (existingCert) {
            return res.status(200).json({
                message: 'Certificate already exists',
                certificate: existingCert
            });
        }

        // Get user and quiz details
        const user = await User.findById(userId).select('name email');
        const quiz = await Quiz.findById(quizId).select('topic difficulty');

        if (!user || !quiz) {
            return res.status(404).json({ message: 'User or Quiz not found' });
        }

        // Create certificate
        const certificate = await Certificate.create({
            userId,
            userName: user.name,
            courseName: `${quiz.topic} - ${quiz.difficulty}`,
            courseType: 'quiz',
            quizId,
            score,
            metadata: {
                level: quiz.difficulty,
                topics: [quiz.topic]
            }
        });

        res.status(201).json({
            message: 'Certificate generated successfully',
            certificate: {
                id: certificate.certificateId,
                name: certificate.userName,
                course: certificate.courseName,
                date: certificate.completionDate,
                score: certificate.score
            }
        });
    } catch (err) {
        console.error('Certificate generation error:', err);
        res.status(500).json({ message: 'Failed to generate certificate' });
    }
};

// Get all certificates for logged-in user
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({
            userId: req.user.id,
            status: 'valid'
        }).sort({ completionDate: -1 });

        res.json({ certificates });
    } catch (err) {
        console.error('Fetch certificates error:', err);
        res.status(500).json({ message: 'Failed to fetch certificates' });
    }
};

// Verify certificate (public endpoint)
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findByCertificateId(certificateId);

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: 'Certificate not found'
            });
        }

        // Verify hash
        const isValid = certificate.verify();

        if (!isValid || certificate.status !== 'valid') {
            return res.status(200).json({
                valid: false,
                message: 'Certificate is invalid or has been revoked'
            });
        }

        res.json({
            valid: true,
            certificate: {
                id: certificate.certificateId,
                name: certificate.userName,
                course: certificate.courseName,
                completionDate: certificate.completionDate,
                score: certificate.score,
                status: certificate.status
            }
        });
    } catch (err) {
        console.error('Verify certificate error:', err);
        res.status(500).json({ message: 'Verification failed' });
    }
};

// Get single certificate details (authenticated)
exports.getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findOne({
            certificateId: id,
            userId: req.user.id
        });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({ certificate });
    } catch (err) {
        console.error('Get certificate error:', err);
        res.status(500).json({ message: 'Failed to fetch certificate' });
    }
};
