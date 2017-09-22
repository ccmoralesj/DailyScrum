const chai = require('chai');
require('chai-as-promised');
const mongoose = require('mongoose');
const roles = require('../utils/roles');
const errors = require('../utils/errors');
const DailyScrum = require('../index');
const expect = chai.expect;

describe('TeamMember Interface', () => {
  let firstTeamMemberId;
  let secondTeamMemberId;
  const teamId = new mongoose.Types.ObjectId();
  const firstTeamMember = {
    role: 'Scrum Master',
    _member: new mongoose.Types.ObjectId(),
    _team: teamId,
  };
  const secondTeamMember = {
    role: 'Developer',
    _member: new mongoose.Types.ObjectId(),
    _team: teamId,
  };
  describe('TeamMember Creation', () => {
    it('Should return a validation error ROLE_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.TeamMember.create({});
      } catch (e) {
        expect(e.message).to.be.eql(errors.ROLE_REQUIRED);
      }
    });
    it('Should return a validation error MEMBER_ID_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.TeamMember.create({ role: firstTeamMember.role });
      } catch (e) {
        expect(e.message).to.be.eql(errors.MEMBER_ID_REQUIRED);
      }
    });
    it('Should return a validation error TEAM_ID_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.TeamMember.create({ role: firstTeamMember.role, memberId: firstTeamMember._member });
      } catch (e) {
        expect(e.message).to.be.eql(errors.TEAM_ID_REQUIRED);
      }
    });
    it('Should return a validation error ROLE_NOT_ALLOWED', async () =>{
      try {
        const fakeRole = 'Fake Support';
        await DailyScrum.Interfaces.TeamMember
          .create({ role: fakeRole, memberId: firstTeamMember._member, teamId: firstTeamMember._team });
      } catch (e) {
        expect(e.message).to.be.eql(errors.ROLE_NOT_ALLOWED);
      }
    });
    it('Should create a TeamMember', async () => {
      const newTeamMember = await DailyScrum.Interfaces.TeamMember
        .create({ role: firstTeamMember.role, memberId: firstTeamMember._member, teamId: firstTeamMember._team });
      expect(newTeamMember).to.has.property('id');
      firstTeamMemberId = newTeamMember.id;
      expect(newTeamMember).to.has.property('role').eql(firstTeamMember.role);
      expect(newTeamMember).to.has.property('_member').eql(firstTeamMember._member);
      expect(newTeamMember).to.has.property('_team').eql(firstTeamMember._team);
    });
    it('Should create another TeamMember', async() => {
      const newTeamMember = await DailyScrum.Interfaces.TeamMember
        .create({ role: secondTeamMember.role, memberId: secondTeamMember._member, teamId: secondTeamMember._team });
      expect(newTeamMember).to.has.property('id');
      secondTeamMemberId = newTeamMember.id;
      expect(newTeamMember).to.has.property('role').eql(secondTeamMember.role);
      expect(newTeamMember).to.has.property('_member').eql(secondTeamMember._member);
      expect(newTeamMember).to.has.property('_team').eql(secondTeamMember._team);
    });
  });
  describe('TeamMember Read', () => {
    it('Should read two teamMembers', async () => {
      const teamMembers = await DailyScrum.Interfaces.TeamMember.read();
      expect(teamMembers).to.be.an('Array').of.lengthOf(2);
      expect(teamMembers[0]).to.has.property('role').eql(firstTeamMember.role);
      expect(teamMembers[0]).to.has.property('_member').eql(firstTeamMember._member);
      expect(teamMembers[0]).to.has.property('_team').eql(firstTeamMember._team);
      expect(teamMembers[1]).to.has.property('role').eql(secondTeamMember.role);
      expect(teamMembers[1]).to.has.property('_member').eql(secondTeamMember._member);
      expect(teamMembers[1]).to.has.property('_team').eql(secondTeamMember._team);
    });
    it('Should read two teamMembers by teamId', async () => {
      const teamMembers = await DailyScrum.Interfaces.TeamMember.readTeamMembersByTeamId(teamId);
      expect(teamMembers).to.be.an('Array').of.lengthOf(2);
      expect(teamMembers[0]).to.has.property('role').eql(firstTeamMember.role);
      expect(teamMembers[0]).to.has.property('_member').eql(firstTeamMember._member);
      expect(teamMembers[0]).to.has.property('_team').eql(firstTeamMember._team);
      expect(teamMembers[1]).to.has.property('role').eql(secondTeamMember.role);
      expect(teamMembers[1]).to.has.property('_member').eql(secondTeamMember._member);
      expect(teamMembers[1]).to.has.property('_team').eql(secondTeamMember._team);
    });
    it('Should find a specific teamMember', async() => {
      const teamMemberFound = await DailyScrum.Interfaces.TeamMember.readById(firstTeamMemberId);
      expect(teamMemberFound).to.has.property('id').eql(firstTeamMemberId);
      expect(teamMemberFound).to.has.property('role').eql(firstTeamMember.role);
      expect(teamMemberFound).to.has.property('_member').eql(firstTeamMember._member);
      expect(teamMemberFound).to.has.property('_team').eql(firstTeamMember._team);
    });
    it('Shouldn\'t find a teamMember', async () => {
      const fakeId = 'testIdToFail';
      const teamMemberNotFound = await DailyScrum.Interfaces.TeamMember.readById(fakeId);
      expect(teamMemberNotFound).to.be.null;
    });
  });
  describe('TeamMember Update', () => {
    it('Should update a TeamMember', async () => {
      const testNewRole = 'Designer';
      const updated = await DailyScrum.Interfaces.TeamMember.update({ id: secondTeamMemberId, role: testNewRole });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(1);
      expect(updated).to.has.property('n').eql(1);

      const teamMemberFound = await DailyScrum.Interfaces.TeamMember.readById(secondTeamMemberId);
      expect(teamMemberFound).to.has.property('id').eql(secondTeamMemberId);
      expect(teamMemberFound).to.has.property('role').eql(testNewRole);
      expect(teamMemberFound).to.has.property('_team').eql(secondTeamMember._team);
      expect(teamMemberFound).to.has.property('_member').eql(secondTeamMember._member);
    });
    it('Shouldn\'t update a TeamMember because ROLE_NOT_ALLOWED', async () => {
      try {
        const fakeId = 'testIdToFail';
        const testNewRole = 'Fake Support';
        await DailyScrum.Interfaces.TeamMember.update({id: fakeId, role: testNewRole});
      } catch (e) {
      expect(e.message).to.be.eql(errors.ROLE_NOT_ALLOWED);
    }
    });
    it('Shouldn\'t update a TeamMember because Id is not found', async () => {
      const fakeId = 'testIdToFail';
      const testNewRole = 'Developer';
      const updated = await DailyScrum.Interfaces.TeamMember.update({ id: fakeId, role: testNewRole });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(0);
      expect(updated).to.has.property('n').eql(0);
    });
  });
  describe('TeamMember Delete', () => {
    it('Should delete a TeamMember', async () => {
      const teamMemberDeleted = await DailyScrum.Interfaces.TeamMember.remove(firstTeamMemberId);
      expect(teamMemberDeleted).to.has.property('result');
      expect(teamMemberDeleted.result).to.has.property('ok').eql(1);
      expect(teamMemberDeleted.result).to.has.property('n').eql(1);
    });
    it('Should delete a TeamMember', async () => {
      const teamMemberDeleted = await DailyScrum.Interfaces.TeamMember.remove(secondTeamMemberId);
      expect(teamMemberDeleted).to.has.property('result');
      expect(teamMemberDeleted.result).to.has.property('ok').eql(1);
      expect(teamMemberDeleted.result).to.has.property('n').eql(1);
    });
    it('Shouldn\'t delete a TeamMember', async () => {
      const fakeId = 'testIdToFail';
      const teamMemberDeleted = await DailyScrum.Interfaces.TeamMember.remove(fakeId);
      expect(teamMemberDeleted).to.has.property('result');
      expect(teamMemberDeleted.result).to.has.property('ok').eql(1);
      expect(teamMemberDeleted.result).to.has.property('n').eql(0);
    });
  });
});