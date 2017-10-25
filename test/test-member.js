const chai = require('chai');
require('chai-as-promised');
const roles = require('../utils/roles');
const errors = require('../utils/errors');
const DailyScrum = require('../index');
const expect = chai.expect;

describe('Member Interface', () => {
  let firstMemberId;
  let secondMemberId;
  const firstMember = {
    name: 'Member Test',
    username: 'testName',
  };
  const secondMember = {
    name: 'Test Smith',
    username: 'userTest',
    birthDate: new Date(94, 1, 20, 7, 30),
  };
  describe('Member Creation', () => {
    it('Should return the available roles for members', () => {
      const rolesFound = DailyScrum.Interfaces.Member.readRoles();
      expect(rolesFound).to.be.eql(roles);
    });
    it('Should return a validation error NAME_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Member.create({});
      } catch (e) {
        expect(e.message).to.be.eql(errors.NAME_REQUIRED);
      }
    });
    it('Should return a validation error USERNAME_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Member.create({ name: 'Test Name' });
      } catch (e) {
        expect(e.message).to.be.eql(errors.USERNAME_REQUIRED);
      }
    });
    it('Should create a Member', async () => {
      const newMember = await DailyScrum.Interfaces.Member.create(firstMember);
      expect(newMember).to.has.property('id');
      firstMemberId = newMember.id;
      expect(newMember).to.has.property('name').eql(firstMember.name);
      expect(newMember).to.has.property('username').eql(firstMember.username);
      expect(newMember).to.not.has.property('birthDate');
    });
    it('Should create another Member', async() => {
      const newMember = await DailyScrum.Interfaces.Member.create(secondMember);
      expect(newMember).to.has.property('id');
      secondMemberId = newMember.id;
      expect(newMember).to.has.property('name').eql(secondMember.name);
      expect(newMember).to.has.property('username').eql(secondMember.username);
      expect(newMember).to.has.property('birthDate').eql(secondMember.birthDate);
    });
  });
  describe('Member Read', () => {
    it('Should read two members', async () => {
      const members = await DailyScrum.Interfaces.Member.read();
      expect(members).to.be.an('Array').of.lengthOf(2);
      expect(members[0]).to.has.property('name').eql(firstMember.name);
      expect(members[1]).to.has.property('name').eql(secondMember.name);
      expect(members[0]).to.has.not.property('birthDate');
      expect(members[1]).to.has.property('birthDate').eql(secondMember.birthDate);
    });
    it('Should find a specific member', async() => {
      const memberFound = await DailyScrum.Interfaces.Member.readById(firstMemberId);
      expect(memberFound).to.has.property('id').eql(firstMemberId);
      expect(memberFound).to.has.property('name').eql(firstMember.name);
      expect(memberFound).to.not.has.property('birthDate');
    });
    it('Shouldn\'t find a member', async () => {
      const fakeId = 'testIdToFail';
      const memberNotFound = await DailyScrum.Interfaces.Member.readById(fakeId);
      expect(memberNotFound).to.be.null;
    });
  });
  describe('Member Update', () => {
    it('Should update a Member', async () => {
      const testName = 'Another Test Name';
      const updated = await DailyScrum.Interfaces.Member.update({ id: secondMemberId, name: testName });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(1);
      expect(updated).to.has.property('n').eql(1);

      const memberFound = await DailyScrum.Interfaces.Member.readById(secondMemberId);
      expect(memberFound).to.has.property('id').eql(secondMemberId);
      expect(memberFound).to.has.property('name').eql(testName);
      expect(memberFound).to.has.property('birthDate').eql(secondMember.birthDate);
    });
    it('Shouldn\'t update a Member', async () => {
      const fakeId = 'testIdToFail';
      const testName = 'Another Test Name';
      const updated = await DailyScrum.Interfaces.Member.update({ id: fakeId, name: testName });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(0);
      expect(updated).to.has.property('n').eql(0);
    });
  });
  describe('Member Delete', () => {
    it('Should delete a Member', async () => {
      const memberDeleted = await DailyScrum.Interfaces.Member.remove(firstMemberId);
      expect(memberDeleted).to.has.property('result');
      expect(memberDeleted.result).to.has.property('ok').eql(1);
      expect(memberDeleted.result).to.has.property('n').eql(1);
    });
    it('Should delete a Member', async () => {
      const memberDeleted = await DailyScrum.Interfaces.Member.remove(secondMemberId);
      expect(memberDeleted).to.has.property('result');
      expect(memberDeleted.result).to.has.property('ok').eql(1);
      expect(memberDeleted.result).to.has.property('n').eql(1);
    });
    it('Shouldn\'t delete a Member', async () => {
      const fakeId = 'testIdToFail';
      const memberDeleted = await DailyScrum.Interfaces.Member.remove(fakeId);
      expect(memberDeleted).to.has.property('result');
      expect(memberDeleted.result).to.has.property('ok').eql(1);
      expect(memberDeleted.result).to.has.property('n').eql(0);
    });
  });
});