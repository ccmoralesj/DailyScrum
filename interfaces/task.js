const logger = require('winston');
const { Task: TaskModel } = require('../schemas');
const errors = require('../utils/errors');

const readById = async (id) => {
  logger.info('Looking for Task with id', id);
  const taskFound = await TaskModel.findById(id).lean({ virtuals: true });
  logger.verbose('Task Found', taskFound);
  return taskFound;
};
/**
 * @param query
 * @returns Task Array
 */
const read = async (query = {}) => {
  logger.info('Looking for Task');
  logger.info('query:', query);
  const tasksFound = await TaskModel.find(query).lean({ virtuals: true });
  logger.verbose('Tasks Found', tasksFound);
  return tasksFound;
};

const create = async ({ description, notes = [], teamId, teamMemberId }) => {
  logger.info('Attempting to create a Task');
  if (!description) throw new Error(errors.DESCRIPTION_REQUIRED);
  if (!teamId) throw new Error(errors.TEAM_ID_REQUIRED);
  if (!teamMemberId) throw new Error(errors.TEAM_MEMBER_ID_REQUIRED);
  const taskCreated =
    await TaskModel.create({ description, notes, _team: teamId, _teamMember: teamMemberId });
  logger.info('Task created successfully');
  return taskCreated.toObject();
};

const update = async ({ id, description, finishDate, archive = false } = {}) => {
  logger.info(`Looking up to update task with id: ${id}`);
  const attrToUpdate = {};
  if (description) attrToUpdate.description = description;
  if (finishDate) attrToUpdate.finishDate = finishDate;
  if (archive) attrToUpdate.archive = archive;
  const updated = await TaskModel.update(
    { _id: id },
    attrToUpdate,
    { runValidators: true, overwrite: false },
  );
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const addNotes = async ({ taskId, notes }) => {
  logger.info(`Will add some notes to task with id ${taskId}`);
  logger.info(`Tasks: ${notes}`);
  const taskToUpdate = await TaskModel.findById(taskId);
  if (!taskToUpdate) throw new Error(errors.TASK_NOT_FOUND);
  logger.info('The task to update was found!');
  notes.forEach((note) => {
    taskToUpdate.notes.push(note);
  });
  const taskSaved = await taskToUpdate.save();
  logger.info('The notes were added and task was saved!');
  return taskSaved;
};

const removeNotes = async ({ taskId, notes }) => {
  logger.info(`Will remove some notes to task with id ${taskId}`);
  logger.info(`Tasks: ${notes}`);
  const taskToUpdate = await TaskModel.findById(taskId);
  if (!taskToUpdate) throw new Error(errors.TASK_NOT_FOUND);
  logger.info('The task to update was found!');
  notes.forEach((note) => {
    const index = taskToUpdate.notes.indexOf(note);
    if (index !== -1) {
      taskToUpdate.notes.splice(index, 1);
    }
  });
  const taskSaved = await taskToUpdate.save();
  logger.info('The notes were removed and task was saved!');
  return taskSaved;
};

const remove = async (id) => {
  logger.info('Removing Task with id', id);
  const taskDeleted = await TaskModel.remove({ _id: id });
  logger.verbose(`Task removed ${taskDeleted}`);
  return taskDeleted;
};

module.exports = { readById, read, create, update, addNotes, removeNotes, remove };
