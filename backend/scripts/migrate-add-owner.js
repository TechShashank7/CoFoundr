const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Startup = require('../models/Startup');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Please provide a Firebase UID as an argument.');
    console.error('Usage: node migrate-add-owner.js <uid>');
    process.exit(1);
  }

  const uid = args[0];

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Startup.updateMany(
      { ownerUid: { $exists: false } },
      { $set: { ownerUid: uid } }
    );

    console.log(`Migration successful. Updated ${result.modifiedCount} startups to have ownerUid: ${uid}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
