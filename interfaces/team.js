const logger = require('winston');
const { Team: TeamModel } = require('../schemas');
const errors = require('../utils/errors');

const readById = async (id) => {
  logger.info('Looking for Team with id', id);
  const teamFound = await TeamModel.findById(id).lean({ virtuals: true });
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
  const teamsFound = await TeamModel.find(query).lean({ virtuals: true });
  logger.verbose('Teams Found', teamsFound);
  return teamsFound;
};

const create = async ({ projectId, name, color = 'none' }) => {
  logger.info(`Attempting to create a Team with name: ${name} and color: ${color}`);
  if (!projectId) throw new Error(errors.PROJECT_ID_REQUIRED);
  if (!name) throw new Error(errors.NAME_REQUIRED);
  const teamCreated = await TeamModel.create({ name, color, _project: projectId });
  logger.info('Team created successfully');
  return teamCreated.toObject();
};

const update = async ({ id, name, color } = {}) => {
  logger.info(`Looking up to update team with id: ${id}`);
  const attrToUpdate = {};
  if (name) attrToUpdate.name = name;
  if (color) attrToUpdate.color = color;
  const updated = await TeamModel.update(
    { _id: id },
    attrToUpdate,
    { runValidators: true, overwrite: false },
  );
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const remove = async (id) => {
  logger.info('Removing Team with id', id);
  const teamDeleted = await TeamModel.remove({ _id: id });
  logger.verbose(`Team removed ${teamDeleted}`);
  return teamDeleted;
};

const addToDo = async ({ teamId, toDos }) => {
  logger.info(`Will add some toDos to team with id ${teamId}`);
  logger.info(`ToDo's: ${toDos}`);
  const teamToUpdate = await TeamModel.findById(teamId);
  if (!teamToUpdate) throw new Error(errors.TEAM_NOT_FOUND);
  logger.info('The team to update was found!');
  toDos.forEach(toDo => teamToUpdate.toDo.push(toDo));
  const teamSaved = await teamToUpdate.save();
  logger.info('The toDos were added and team was saved!');
  return teamSaved;
};

const removeToDo = async ({ teamId, toDos }) => {
  logger.info(`Will remove some toDos to team with id ${teamId}`);
  logger.info(`teams: ${toDos}`);
  const teamToUpdate = await TeamModel.findById(teamId);
  if (!teamToUpdate) throw new Error(errors.TEAM_NOT_FOUND);
  logger.info('The team to update was found!');
  toDos.forEach((toDo) => {
    const index = teamToUpdate.toDo.indexOf(toDo);
    if (index !== -1) {
      teamToUpdate.toDo.splice(index, 1);
    }
  });
  const teamSaved = await teamToUpdate.save();
  logger.info('The toDos were removed and team was saved!');
  return teamSaved;
};

module.exports = { readById, read, create, update, addToDo, removeToDo, remove };
