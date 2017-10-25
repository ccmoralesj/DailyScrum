const chai = require('chai');
require('chai-as-promised');
const roles = require('../utils/roles');
const errors = require('../utils/errors');
const DailyScrum = require('../index');
const expect = chai.expect;

describe('Team Interface', () => {
  let firstTeamId;
  let secondTeamId;
  const firstTeam = {
    name: 'Team Test',
  };
  const secondTeam = {
    name: 'Test Team',
  };
  describe('Team Creation', () => {
    it('Should return a validation error NAME_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Team.create({});
      } catch (e) {
        expect(e.message).to.be.eql(errors.NAME_REQUIRED);
      }
    });
    it('Should create a Team', async () => {
      const newTeam = await DailyScrum.Interfaces.Team.create(firstTeam);
      expect(newTeam).to.has.property('id');
      firstTeamId = newTeam.id;
      expect(newTeam).to.has.property('name').eql(firstTeam.name);
    });
    it('Should create another Team', async() => {
      const newTeam = await DailyScrum.Interfaces.Team.create(secondTeam);
      expect(newTeam).to.has.property('id');
      secondTeamId = newTeam.id;
      expect(newTeam).to.has.property('name').eql(secondTeam.name);
    });
  });
  describe('Team Read', () => {
    it('Should read two teams', async () => {
      const teams = await DailyScrum.Interfaces.Team.read();
      expect(teams).to.be.an('Array').of.lengthOf(2);
      expect(teams[0]).to.has.property('name').eql(firstTeam.name);
      expect(teams[1]).to.has.property('name').eql(secondTeam.name);
    });
    it('Should find a specific team', async() => {
      const teamFound = await DailyScrum.Interfaces.Team.readById(firstTeamId);
      expect(teamFound).to.has.property('id').eql(firstTeamId);
      expect(teamFound).to.has.property('name').eql(firstTeam.name);
    });
    it('Shouldn\'t find a team', async () => {
      const fakeId = 'testIdToFail';
      const teamNotFound = await DailyScrum.Interfaces.Team.readById(fakeId);
      expect(teamNotFound).to.be.null;
    });
  });
  describe('Team Update', () => {
    it('Should update a Team', async () => {
      const testName = 'Another Test Name';
      const updated = await DailyScrum.Interfaces.Team.update({ id: secondTeamId, name: testName });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(1);
      expect(updated).to.has.property('n').eql(1);

      const teamFound = await DailyScrum.Interfaces.Team.readById(secondTeamId);
      expect(teamFound).to.has.property('id').eql(secondTeamId);
      expect(teamFound).to.has.property('name').eql(testName);
    });
    it('Shouldn\'t update a Team', async () => {
      const fakeId = 'testIdToFail';
      const testName = 'Another Test Name';
      const updated = await DailyScrum.Interfaces.Team.update({ id: fakeId, name: testName });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(0);
      expect(updated).to.has.property('n').eql(0);
    });
    it('should add two toDo\'s to a team', async () => {
      const testToDos = ['some test ToDo', 'some ToDo test'];
      const teamWithToDoAdded = await DailyScrum.Interfaces.Team.addToDo({ teamId: firstTeamId, toDos: testToDos });
      expect(teamWithToDoAdded).to.has.property('id').eql(firstTeamId);
      expect(teamWithToDoAdded).to.has.property('name').eql(firstTeam.name);
      expect(teamWithToDoAdded).to.has.property('toDo').eql(testToDos);
    });
    it('should remove a ToDo to a team', async () => {
      const testToDoToRemove = ['some test ToDo'];
      const testToDo = ['some ToDo test'];
      const teamWithToDoAdded = await DailyScrum.Interfaces.Team.removeToDo({ teamId: firstTeamId, toDos: testToDoToRemove });
      expect(teamWithToDoAdded).to.has.property('id').eql(firstTeamId);
      expect(teamWithToDoAdded).to.has.property('toDo').eql(testToDo);
      expect(teamWithToDoAdded).to.has.property('name').eql(firstTeam.name);
    });
  });
  describe('Team Delete', () => {
    it('Should delete a Team', async () => {
      const teamDeleted = await DailyScrum.Interfaces.Team.remove(firstTeamId);
      expect(teamDeleted).to.has.property('result');
      expect(teamDeleted.result).to.has.property('ok').eql(1);
      expect(teamDeleted.result).to.has.property('n').eql(1);
    });
    it('Should delete a Team', async () => {
      const teamDeleted = await DailyScrum.Interfaces.Team.remove(secondTeamId);
      expect(teamDeleted).to.has.property('result');
      expect(teamDeleted.result).to.has.property('ok').eql(1);
      expect(teamDeleted.result).to.has.property('n').eql(1);
    });
    it('Shouldn\'t delete a Team', async () => {
      const fakeId = 'testIdToFail';
      const teamDeleted = await DailyScrum.Interfaces.Team.remove(fakeId);
      expect(teamDeleted).to.has.property('result');
      expect(teamDeleted.result).to.has.property('ok').eql(1);
      expect(teamDeleted.result).to.has.property('n').eql(0);
    });
  });
});