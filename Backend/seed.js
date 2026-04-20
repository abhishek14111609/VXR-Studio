require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Portfolio = require('./models/Portfolio');
const Company = require('./models/Company');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Service.deleteMany({});
        await Portfolio.deleteMany({});
        await Company.deleteMany({});
        console.log('✅ Cleared existing data');

        // Seed Services
        const servicesData = [
            {
                serviceTitle: 'Social Media Management',
                description: 'Content planning, publishing, and audience growth systems built around your brand voice.',
                highlights: ['Content calendars', 'Community management', 'Monthly reporting'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹5,999',
                        period: '/month',
                        features: [
                            { text: '3 Posts/week' },
                            { text: 'Basic Graphics' },
                            { text: 'Engagement Management' },
                            { text: 'Monthly Report' },
                            { text: 'Basic Strategy' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹12,999',
                        period: '/month',
                        features: [
                            { text: '5 Posts/week' },
                            { text: 'Video Reels' },
                            { text: 'Growth Strategy' },
                            { text: 'Weekly Report' },
                            { text: 'Community Management' },
                            { text: 'Ad Support' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹24,999',
                        period: '/month',
                        features: [
                            { text: 'Daily Posts' },
                            { text: 'Cinematic Content' },
                            { text: 'Ad Management' },
                            { text: '24/7 Support' },
                            { text: 'Influencer Campaigns' },
                            { text: 'Custom Strategy' },
                            { text: 'Performance Optimization' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Meta Ads Solutions',
                description: 'Lead-generation and awareness campaigns optimized for reach, conversions, and efficient spend.',
                highlights: ['Campaign setup', 'Creative testing', 'Performance optimization'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹9,999',
                        period: '/month',
                        features: [
                            { text: 'Campaign Setup' },
                            { text: '₹20k Ad Budget Management' },
                            { text: 'Basic Targeting' },
                            { text: 'Weekly Reports' },
                            { text: 'Single Platform' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹19,999',
                        period: '/month',
                        features: [
                            { text: 'Campaign Setup & Optimization' },
                            { text: '₹50k Ad Budget Management' },
                            { text: 'Advanced Targeting' },
                            { text: 'Bi-weekly Reports' },
                            { text: 'A/B Testing' },
                            { text: 'Multi-Platform' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹39,999',
                        period: '/month',
                        features: [
                            { text: 'Dedicated Account Manager' },
                            { text: '₹100k+ Ad Budget Management' },
                            { text: 'Advanced Targeting & Retargeting' },
                            { text: 'Daily Optimization' },
                            { text: 'Weekly Strategy Calls' },
                            { text: 'Custom Reporting' },
                            { text: 'Lead Generation Focus' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Graphic Designing & Posts',
                description: 'High-impact visuals, feed designs, and branded post systems that stay consistent everywhere.',
                highlights: ['Post creatives', 'Brand templates', 'Platform-ready sizing'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹4,999',
                        period: '/month',
                        features: [
                            { text: '4 Post Designs/week' },
                            { text: 'Social Media Templates' },
                            { text: 'Brand Guidelines Use' },
                            { text: 'Revision: 2 per design' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹9,999',
                        period: '/month',
                        features: [
                            { text: '8 Post Designs/week' },
                            { text: 'Stories & Infographics' },
                            { text: 'Custom Templates' },
                            { text: 'Revision: 5 per design' },
                            { text: 'Feed Aesthetic Planning' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹19,999',
                        period: '/month',
                        features: [
                            { text: 'Unlimited Designs' },
                            { text: 'Custom Brand Identity' },
                            { text: '3D & Motion Graphics' },
                            { text: 'Unlimited Revisions' },
                            { text: 'Priority Support' },
                            { text: 'Seasonal Campaigns' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Reels & Video Editing',
                description: 'Fast-turnaround video content optimized for virality, engagement, and conversions.',
                highlights: ['Motion graphics', 'Trend integration', '4K quality'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹7,999',
                        period: '/reel',
                        features: [
                            { text: '1 Reel Edit' },
                            { text: 'Basic Transitions' },
                            { text: 'Color Grading' },
                            { text: 'Captions & Music' },
                            { text: 'Delivery: 48 hours' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹14,999',
                        period: '/month',
                        features: [
                            { text: '4 Reels/month' },
                            { text: 'Motion Graphics' },
                            { text: 'Advanced Editing' },
                            { text: 'Trend Integration' },
                            { text: 'Weekly Delivery' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹29,999',
                        period: '/month',
                        features: [
                            { text: 'Unlimited Reels' },
                            { text: '4K Quality' },
                            { text: 'Cinematic Effects' },
                            { text: 'Animation & Graphics' },
                            { text: 'Daily Delivery' },
                            { text: 'Creative Direction' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Advertising & Promotions',
                description: 'Strategic ad campaigns and promotional strategies tailored to your target audience.',
                highlights: ['Campaign planning', 'Multi-channel reach', 'Conversion focused'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹8,999',
                        period: '/campaign',
                        features: [
                            { text: 'Campaign Planning' },
                            { text: 'Promotional Graphics' },
                            { text: 'Limited Timeline' },
                            { text: 'Single Channel' },
                            { text: 'Basic Analytics' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹17,999',
                        period: '/campaign',
                        features: [
                            { text: 'Multi-Channel Campaign' },
                            { text: 'Custom Creatives' },
                            { text: 'Duration: Up to 1 month' },
                            { text: 'A/B Testing' },
                            { text: 'Detailed Analytics' },
                            { text: 'Seasonal Support' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹34,999',
                        period: '/campaign',
                        features: [
                            { text: 'End-to-End Campaign' },
                            { text: 'Unlimited Creatives' },
                            { text: 'Custom Duration' },
                            { text: 'Advanced Analytics' },
                            { text: 'Retargeting Strategy' },
                            { text: 'Dedicated Support' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Digital Marketing',
                description: 'Comprehensive digital strategies including SEO, SEM, and content marketing.',
                highlights: ['SEO optimization', 'Keyword research', 'Competitor analysis'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹6,999',
                        period: '/month',
                        features: [
                            { text: 'SEO Basics' },
                            { text: 'Keyword Research' },
                            { text: 'Monthly Report' },
                            { text: 'Single Channel' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹14,999',
                        period: '/month',
                        features: [
                            { text: 'SEO + SEM Strategy' },
                            { text: 'Content Optimization' },
                            { text: 'Weekly Updates' },
                            { text: 'Multi-Channel' },
                            { text: 'Competitor Analysis' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹29,999',
                        period: '/month',
                        features: [
                            { text: 'Full Digital Strategy' },
                            { text: 'Advanced SEO' },
                            { text: 'Content Calendar' },
                            { text: 'Daily Optimization' },
                            { text: 'Custom Analytics' },
                            { text: 'Dedicated Strategist' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Influencer Marketing',
                description: 'Connect with the right influencers to amplify your brand message and reach.',
                highlights: ['Influencer matching', 'Campaign coordination', 'Performance tracking'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹15,999',
                        period: '/campaign',
                        features: [
                            { text: 'Micro Influencer' },
                            { text: '1 Post Only' },
                            { text: 'Campaign Coordination' },
                            { text: 'Basic Reporting' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹34,999',
                        period: '/campaign',
                        features: [
                            { text: 'Mid-Tier Influencers' },
                            { text: 'Multiple Posts' },
                            { text: 'Content Approval' },
                            { text: 'Detailed Analytics' },
                            { text: 'Campaign Timeline Support' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹64,999',
                        period: '/campaign',
                        features: [
                            { text: 'Top-Tier Influencers' },
                            { text: 'Full Campaign Support' },
                            { text: 'Unlimited Posts' },
                            { text: 'Story Links & Swipe-ups' },
                            { text: 'Performance Optimization' },
                            { text: 'Dedicated Manager' }
                        ],
                        highlight: false
                    }
                ]
            },
            {
                serviceTitle: 'Branding that Actually Converts',
                description: 'Complete brand identity and strategy that resonates with your audience and drives action.',
                highlights: ['Brand strategy', 'Logo design', 'Brand guidelines'],
                tiers: [
                    {
                        name: 'Starter',
                        price: '₹19,999',
                        period: 'one-time',
                        features: [
                            { text: 'Logo Design' },
                            { text: 'Color Palette' },
                            { text: 'Basic Brand Guidelines' },
                            { text: 'Single Format' }
                        ],
                        highlight: false
                    },
                    {
                        name: 'Professional',
                        price: '₹39,999',
                        period: 'one-time',
                        features: [
                            { text: 'Complete Brand Identity' },
                            { text: 'Logo + Variants' },
                            { text: 'Typography Guide' },
                            { text: 'Brand Voice Document' },
                            { text: 'Multi-Format Assets' },
                            { text: '2 Revision Rounds' }
                        ],
                        highlight: true
                    },
                    {
                        name: 'Elite',
                        price: '₹79,999',
                        period: 'one-time',
                        features: [
                            { text: 'Full Brand Strategy' },
                            { text: 'Market Research' },
                            { text: 'Complete Guidelines' },
                            { text: 'Website Brand Template' },
                            { text: 'All Marketing Collateral' },
                            { text: 'Unlimited Revisions' },
                            { text: '3 Months Support' }
                        ],
                        highlight: false
                    }
                ]
            }
        ];

        await Service.insertMany(servicesData);
        console.log('✅ Services seeded successfully');

        // Seed Portfolio
        const portfolioData = [
            {
                title: 'E-Commerce Growth Campaign',
                description: 'Increased sales by 150% through targeted Meta Ads',
                mediaUrl: 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?auto=format&fit=crop&q=80',
                category: 'Ads',
                client: 'Fashion Brand',
                mediaType: 'image',
                isFeatured: true
            },
            {
                title: 'Viral Reels Series',
                description: '2M+ views across 30 reels in 2 months',
                mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
                category: 'Reels',
                client: 'Beauty Brand',
                mediaType: 'image',
                isFeatured: true
            },
            {
                title: 'Brand Photography',
                description: 'Professional product photography and lifestyle shots',
                mediaUrl: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?auto=format&fit=crop&q=80',
                category: 'Photography',
                client: 'Startup',
                mediaType: 'image',
                isFeatured: false
            },
            {
                title: 'Social Media Rebrand',
                description: 'Complete brand identity redesign and strategy',
                mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80',
                category: 'Branding',
                client: 'Tech Company',
                mediaType: 'image',
                isFeatured: true
            },
            {
                title: 'Event Promotion',
                description: '5000+ registrations through social media campaign',
                mediaUrl: 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?auto=format&fit=crop&q=80',
                category: 'Ads',
                client: 'Event Organizer',
                mediaType: 'image',
                isFeatured: false
            },
            {
                title: 'Product Launch Campaign',
                description: '₹50L+ revenue from digital campaign launch',
                mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
                category: 'Reels',
                client: 'FMCG Brand',
                mediaType: 'image',
                isFeatured: true
            }
        ];

        await Portfolio.insertMany(portfolioData);
        console.log('✅ Portfolio seeded successfully');

        // Seed Company Info
        const companyData = {
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
        };

        await Company.create(companyData);
        console.log('✅ Company info seeded successfully');

        console.log('✅ Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
