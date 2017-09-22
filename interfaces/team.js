const logger = require('winston');
const TeamModel = require('../schemas').Team;
const errors = require('../utils/errors');

const readById = async (id) => {
  logger.info('Looking for Team with id', id);
  const teamFound = await TeamModel.findById(id).lean();
  logger.verbose('Team Found', teamFound);
  return teamFound;
};
/**
 * @param query
 * @returns Team Array
 */
const read = async (query = {}) => {
  logger.info('Looking for Team');
  logger.info('query:', query);
  const teamsFound = await TeamModel.find(query).lean();
  logger.verbose('Teams Found', teamsFound);
  return teamsFound;
};

const create = async ({ name }) => {
  logger.info(`Attempting to create a Team with name: ${name}`);
  if (!name) throw new Error(errors.NAME_REQUIRED);
  const teamCreated = await TeamModel.create({ name });
  logger.info('Team created successfully');
  return teamCreated.toObject();
};

const update = async ({ id, name } = {}) => {
  logger.info(`Looking up to update team with id: ${id}`);
  const attrToUpdate = {};
  if (name) attrToUpdate.name = name;
  const updated = await TeamModel.update({ _id: id }, attrToUpdate, { runValidators: true, overwrite: false });
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const remove = async (id) => {
  logger.info('Removing Team with id', id);
  const teamDeleted = await TeamModel.remove({ _id: id });
  logger.verbose(`Team removed ${teamDeleted}`);
  return teamDeleted;
};

module.exports = { readById, read, create, update, remove };
