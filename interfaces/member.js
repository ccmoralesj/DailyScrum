const logger = require('winston');
const MemberModel = require('../schemas').Member;
const roles = require('../utils/roles');
const errors = require('../utils/errors');

/**
 *  @returns Roles available
 */
const readRoles = () => roles;

const readById = async (id) => {
  logger.info('Looking for Member with id', id);
  const memberFound = await MemberModel.findById(id).lean();
  logger.verbose('Member Found', memberFound);
  return memberFound;
};
/**
 * @param query
 * @returns Member Array
 */
const read = async (query = {}) => {
  logger.info('Looking for Member');
  logger.info('query:', query);
  const membersFound = await MemberModel.find(query).lean();
  logger.verbose('Members Found', membersFound);
  return membersFound;
};

const create = async ({ name, birthDate }) => {
  logger.info(`Attempting to create a Member with name: ${name} and birthDate: ${birthDate}`);
  if (!name) throw new Error(errors.NAME_REQUIRED);
  const memberCreated = await MemberModel.create({ name, birthDate });
  logger.info('Member created successfully');
  return memberCreated.toObject();
};

const update = async ({ id, name, birthDate } = {}) => {
  logger.info(`Looking up to update member with id: ${id}`);
  const attrToUpdate = {};
  if (name) attrToUpdate.name = name;
  if (birthDate) attrToUpdate.birthDate = birthDate;
  const updated = await MemberModel.update({ _id: id }, attrToUpdate, { runValidators: true, overwrite: false });
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const remove = async (id) => {
  logger.info('Removing Member with id', id);
  const memberDeleted = await MemberModel.remove({ _id: id });
  logger.verbose(`Member removed ${memberDeleted}`);
  return memberDeleted;
};

module.exports = { readRoles, readById, read, create, update, remove };
