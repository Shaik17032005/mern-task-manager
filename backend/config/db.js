const dns = require('dns');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  const rawConnString = process.env.MONGODB_URI?.trim();
  if (!rawConnString) {
    throw new Error('MONGODB_URI is not set in backend/.env');
  }

  let connString = rawConnString;

  if (connString.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('Using public DNS servers for Atlas SRV lookup.');

    if (!/^mongodb\+srv:\/\/[^/]+\//.test(connString)) {
      connString = connString.replace(/\/?\?/, '/taskmanager?');
      if (!connString.includes('?')) {
        connString += '/taskmanager';
      }
    }
  }

  try {
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    if (error.message.toLowerCase().includes('bad auth')) {
      console.error(
        'MongoDB Atlas authentication failed. Verify the username/password in backend/.env and percent-encode any special characters in the password.'
      );
    }
    throw error;
  }
};

module.exports = {
  connectDB,
};
