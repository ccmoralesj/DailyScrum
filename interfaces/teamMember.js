const logger = require('winston');
const { TeamMember: TeamMemberModel } = require('../schemas');
const errors = require('../utils/errors');
const roles = require('../utils/roles');

const readTeamMembersByTeamId = async (teamId, opts = { sortBy: 'createdAt' }) => {
  logger.info('Looking for Members from team with id', teamId);
  const teamMembersFound =
    await TeamMemberModel.find({ _team: teamId }).sort(opts.sortBy).lean({ virtuals: true });
  logger.verbose('TeamMember\'s Found', teamMembersFound);
  return teamMembersFound;
};

const readById = async (id) => {
  logger.info('Looking for TeamMember with id', id);
  const teamMemberFound = await TeamMemberModel.findById(id).lean({ virtuals: true });
  logger.verbose('TeamMember Found', teamMemberFound);
  return teamMemberFound;
};
/**
 * @param query
 * @returns TeamMember Array
 */
const read = async (query = {}) => {
  logger.info('Looking for TeamMember');
  logger.info('query:', query);
  const teamMembersFound = await TeamMemberModel.find(query).lean({ virtuals: true });
  logger.verbose('TeamMembers Found', teamMembersFound);
  return teamMembersFound;
};

const create = async ({ role, memberId, teamId }) => {
  logger.info(`Attempting to create a TeamMember with role: ${role}`);
  if (!role) throw new Error(errors.ROLE_REQUIRED);
  if (!memberId) throw new Error(errors.MEMBER_ID_REQUIRED);
  if (!teamId) throw new Error(errors.TEAM_ID_REQUIRED);
  const isRoleAllowed = roles.indexOf(role);
  if (isRoleAllowed < 0) throw new Error(errors.ROLE_NOT_ALLOWED);
  const teamMemberCreated =
    await TeamMemberModel.create({ role, _member: memberId, _team: teamId });
  logger.info('TeamMember created successfully');
  return teamMemberCreated.toObject();
};

const update = async ({ id, role, teamId } = {}) => {
  logger.info(`Looking up to update teamMember with id: ${id}`);
  const attrToUpdate = {};
  if (role) {
    const isRoleAllowed = roles.indexOf(role);
    if (isRoleAllowed < 0) throw new Error(errors.ROLE_NOT_ALLOWED);
    attrToUpdate.role = role;
  }
  if (teamId) attrToUpdate._team = teamId;
  const updated = await TeamMemberModel.update(
    { _id: id },
    attrToUpdate,
    { runValidators: true, overwrite: false }
  );
  logger.verbose(`Updated: ${updated}`);
  return updated;
};

const remove = async (id) => {
  logger.info('Removing TeamMember with id', id);
  const teamMemberDeleted = await TeamMemberModel.remove({ _id: id });
  logger.verbose(`TeamMember removed ${teamMemberDeleted}`);
  return teamMemberDeleted;
};

module.exports = { readTeamMembersByTeamId, readById, read, create, update, remove };
