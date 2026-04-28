const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import models
const Company = require('./models/Company');

async function fixImageUrls() {
  try {
    console.log('🔧 Fixing image URLs in database...');
    
    // Update company data
    const companyResult = await Company.updateMany(
      {},
      [
        {
          $set: {
            teamMembers: {
              $map: {
                input: "$teamMembers",
                as: "member",
                in: {
                  $mergeObjects: [
                    "$$member",
                    {
                      image: {
                        $replaceAll: {
                          input: "$$member.image",
                          find: "http://localhost:5000",
                          replacement: "https://backend.vxrmedia.in"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      ]
    );
    
    console.log(`✅ Updated ${companyResult.modifiedCount} company documents`);
    
    // You can add similar updates for other models here if needed
    // For example, if you have Portfolio items with images:
    // const Portfolio = require('./models/Portfolio');
    // const portfolioResult = await Portfolio.updateMany(
    //   { mediaUrl: { $regex: "localhost:5000" } },
    //   { $set: { mediaUrl: { $replaceAll: { input: "$mediaUrl", find: "http://localhost:5000", replacement: "https://backend.vxrmedia.in" } } } }
    // );
    
    console.log('🎉 Image URLs fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixImageUrls();
