const logger = require('winston');
const { Project: ProjectModel } = require('../schemas');
const errors = require('../utils/errors');

const readById = async (id) => {
  logger.info('Looking for Project with id', id);
  const projectFound = await ProjectModel.findById(id).lean({ virtuals: true });
  logger.verbose('Project Found', projectFound);
  return projectFound;
};
/**
 * @param query
 * @returns Project Array
 */
const read = async (query = {}) => {
  logger.info('Looking for Project');
  logger.info('query:', query);
  const projectsFound = await ProjectModel.find(query).lean({ virtuals: true });
  logger.verbose('Projects Found', projectsFound);
  return projectsFound;
};

const create = async ({ name, description }) => {
  logger.info(`Attempting to create a Project with name: ${name} and description: ${description}`);
  if (!name) throw new Error(errors.NAME_REQUIRED);
  const projectCreated = await ProjectModel.create({ name, description });
  logger.info('Project created successfully');
  return projectCreated.toObject();
};

const update = async ({ id, name, description, finished = false } = {}) => {
  logger.info(`Looking up to update project with id: ${id}`);
  const attrToUpdate = {};
  if (name) attrToUpdate.name = name;
  if (description) attrToUpdate.description = description;
  if (finished) attrToUpdate.finished = finished;
  const updated = await ProjectModel.update(
    { _id: id },
    attrToUpdate,
    { runValidators: true, overwrite: false },
  );
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const remove = async (id) => {
  logger.info('Removing Project with id', id);
  const projectDeleted = await ProjectModel.remove({ _id: id });
  logger.verbose(`Project removed ${projectDeleted}`);
  return projectDeleted;
};

const addToDo = async ({ projectId, toDos }) => {
  logger.info(`Will add some toDos to project with id ${projectId}`);
  logger.info(`ToDo's: ${toDos}`);
  const projectToUpdate = await ProjectModel.findById(projectId);
  if (!projectToUpdate) throw new Error(errors.TEAM_NOT_FOUND);
  logger.info('The project to update was found!');
  toDos.forEach(toDo => projectToUpdate.toDo.push(toDo));
  const projectSaved = await projectToUpdate.save();
  logger.info('The toDos were added and project was saved!');
  return projectSaved;
};

const removeToDo = async ({ projectId, toDos }) => {
  logger.info(`Will remove some toDos to project with id ${projectId}`);
  logger.info(`projects: ${toDos}`);
  const projectToUpdate = await ProjectModel.findById(projectId);
  if (!projectToUpdate) throw new Error(errors.TEAM_NOT_FOUND);
  logger.info('The project to update was found!');
  toDos.forEach((toDo) => {
    const index = projectToUpdate.toDo.indexOf(toDo);
    if (index !== -1) {
      projectToUpdate.toDo.splice(index, 1);
    }
  });
  const projectSaved = await projectToUpdate.save();
  logger.info('The toDos were removed and project was saved!');
  return projectSaved;
};

module.exports = { readById, read, create, update, addToDo, removeToDo, remove };
