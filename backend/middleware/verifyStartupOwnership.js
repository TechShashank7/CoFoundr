const Startup = require('../models/Startup');

const verifyStartupOwnership = async (startupId, uid) => {
  const startup = await Startup.findById(startupId);
  if (!startup) {
    throw new Error('NOT_FOUND');
  }
  if (startup.ownerUid !== uid) {
    throw new Error('FORBIDDEN');
  }
  return startup;
};

module.exports = verifyStartupOwnership;
