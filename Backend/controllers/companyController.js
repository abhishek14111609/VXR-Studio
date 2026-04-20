const Company = require('../models/Company');

exports.getCompany = async (req, res) => {
    try {
        let company = await Company.findOne();
        if (!company) {
            company = await Company.create({
                companyName: 'VXR Media House',
                tagline: 'Social-first creative, media, and advertising solutions that convert.',
                mission: 'To deliver social-first creative solutions that drive engagement, conversions, and measurable growth for brands.',
                vision: 'To be the go-to partner for businesses seeking authentic, results-driven digital marketing.',
                phone: '96623 96693',
                email: 'vxrmediaa@gmail.com',
                whatsapp: '919662396693',
                address: '304 B, 3rd Floor, 4 Plus Complex, Opposite Poojara Telecom, Astron Chowk, Rajkot',
                location: 'Rajkot, Gujarat, India',
                benefits: [
                    { title: 'Results-Driven', description: 'Every campaign is built with measurable KPIs and ROI focus.' },
                    { title: 'Growth-Focused', description: 'We scale what works and pivot on data, not guesses.' },
                    { title: 'Collaborative', description: 'Your team is our team. We communicate, iterate, and improve together.' },
                    { title: 'Fast Execution', description: 'Ideas to execution in days, not weeks. Agile and responsive.' }
                ]
            });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        let company = await Company.findOne();
        if (!company) {
            company = await Company.create(req.body);
        } else {
            company = await Company.findOneAndUpdate({}, req.body, { new: true });
        }
        res.json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
