const chai = require('chai');
require('chai-as-promised');
const mongoose = require('mongoose');
const roles = require('../utils/roles');
const errors = require('../utils/errors');
const DailyScrum = require('../index');
const expect = chai.expect;

describe('Task Interface', () => {
  let firstTaskId;
  let secondTaskId;
  const teamId = new mongoose.Types.ObjectId();
  const notes = 'Test Note';
  const firstTask = {
    description: 'Some test task',
    _teamMember: new mongoose.Types.ObjectId(),
    _team: teamId,
    notes: [notes],
  };
  const secondTask = {
    description: 'Some test task',
    _teamMember: new mongoose.Types.ObjectId(),
    _team: teamId,
  };
  describe('Task Creation', () => {
    it('Should return a validation error DESCRIPTION_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Task.create({});
      } catch (e) {
        expect(e.message).to.be.eql(errors.DESCRIPTION_REQUIRED);
      }
    });
    it('Should return a validation error TEAM_ID_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Task.create({ description: firstTask.description });
      } catch (e) {
        expect(e.message).to.be.eql(errors.TEAM_ID_REQUIRED);
      }
    });
    it('Should return a validation error TEAM_MEMBER_ID_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Task.create({ description: firstTask.description, teamId: teamId });
      } catch (e) {
        expect(e.message).to.be.eql(errors.TEAM_MEMBER_ID_REQUIRED);
      }
    });
    it('Should create a Task', async () => {
      const newTask = await DailyScrum.Interfaces.Task
        .create({ description: firstTask.description, teamId: teamId, teamMemberId: firstTask._teamMember, notes: firstTask.notes });
      expect(newTask).to.has.property('id');
      firstTaskId = newTask.id;
      expect(newTask).to.has.property('description').eql(firstTask.description);
      expect(newTask).to.has.property('_teamMember').eql(firstTask._teamMember);
      expect(newTask).to.has.property('_team').eql(firstTask._team);
      expect(newTask).to.has.property('notes').eql(firstTask.notes);
    });
    it('Should create another Task', async() => {
      const newTask = await DailyScrum.Interfaces.Task
        .create({ description: secondTask.description, teamId: teamId, teamMemberId: secondTask._teamMember });
      expect(newTask).to.has.property('id');
      secondTaskId = newTask.id;
      expect(newTask).to.has.property('description').eql(secondTask.description);
      expect(newTask).to.has.property('_teamMember').eql(secondTask._teamMember);
      expect(newTask).to.has.property('_team').eql(secondTask._team);
      expect(newTask).to.has.property('notes').eql([]);
    });
  });
  describe('Task Read', () => {
    it('Should read two tasks', async () => {
      const tasks = await DailyScrum.Interfaces.Task.read();
      expect(tasks).to.be.an('Array').of.lengthOf(2);
      expect(tasks[0]).to.has.property('description').eql(firstTask.description);
      expect(tasks[0]).to.has.property('_teamMember').eql(firstTask._teamMember);
      expect(tasks[0]).to.has.property('_team').eql(firstTask._team);
      expect(tasks[1]).to.has.property('description').eql(secondTask.description);
      expect(tasks[1]).to.has.property('_teamMember').eql(secondTask._teamMember);
      expect(tasks[1]).to.has.property('_team').eql(secondTask._team);
    });
    it('Should find a specific task', async() => {
      const taskFound = await DailyScrum.Interfaces.Task.readById(firstTaskId);
      expect(taskFound).to.has.property('id').eql(firstTaskId);
      expect(taskFound).to.has.property('description').eql(firstTask.description);
      expect(taskFound).to.has.property('_teamMember').eql(firstTask._teamMember);
      expect(taskFound).to.has.property('_team').eql(firstTask._team);
    });
    it('Shouldn\'t find a task', async () => {
      const fakeId = 'testIdToFail';
      const taskNotFound = await DailyScrum.Interfaces.Task.readById(fakeId);
      expect(taskNotFound).to.be.null;
    });
  });
  describe('Task Update', () => {
    it('Should update a Task', async () => {
      const testFinishDate = new Date();
      const updated = await DailyScrum.Interfaces.Task.update({ id: firstTaskId, finishDate: testFinishDate });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(1);
      expect(updated).to.has.property('n').eql(1);

      const taskFound = await DailyScrum.Interfaces.Task.readById(firstTaskId);
      expect(taskFound).to.has.property('id').eql(firstTaskId);
      expect(taskFound).to.has.property('description').eql(firstTask.description);
      expect(taskFound).to.has.property('finishDate').eql(testFinishDate);
      expect(taskFound).to.has.property('_team').eql(firstTask._team);
      expect(taskFound).to.has.property('_teamMember').eql(firstTask._teamMember);
    });
    it('should add two notes to a task', async () => {
      const testNotes = ['some test trouble', 'some test problem'];
      const taskWithNoteAdded = await DailyScrum.Interfaces.Task.addNotes({ taskId: secondTaskId, notes: testNotes });
      expect(taskWithNoteAdded).to.has.property('id').eql(secondTaskId);
      expect(taskWithNoteAdded).to.has.property('description').eql(secondTask.description);
      expect(taskWithNoteAdded).to.has.property('notes').eql(testNotes);
      expect(taskWithNoteAdded).to.has.property('_team').eql(secondTask._team);
      expect(taskWithNoteAdded).to.has.property('_teamMember').eql(secondTask._teamMember);
    });
    it('should remove a note to a task', async () => {
      const testNotesToRemove = ['some test trouble'];
      const testNotes = ['some test problem'];
      const taskWithNoteAdded = await DailyScrum.Interfaces.Task.removeNotes({ taskId: secondTaskId, notes: testNotesToRemove });
      expect(taskWithNoteAdded).to.has.property('id').eql(secondTaskId);
      expect(taskWithNoteAdded).to.has.property('description').eql(secondTask.description);
      expect(taskWithNoteAdded).to.has.property('notes').eql(testNotes);
      expect(taskWithNoteAdded).to.has.property('_team').eql(secondTask._team);
      expect(taskWithNoteAdded).to.has.property('_teamMember').eql(secondTask._teamMember);
    });
    it('Shouldn\'t update a Task because Id is not found', async () => {
      const fakeId = 'testIdToFail';
      const testDescription = 'new Test Description';
      const updated = await DailyScrum.Interfaces.Task.update({ id: fakeId, description: testDescription });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(0);
      expect(updated).to.has.property('n').eql(0);
    });
  });
  describe('Task Delete', () => {
    it('Should delete a Task', async () => {
      const taskDeleted = await DailyScrum.Interfaces.Task.remove(firstTaskId);
      expect(taskDeleted).to.has.property('result');
      expect(taskDeleted.result).to.has.property('ok').eql(1);
      expect(taskDeleted.result).to.has.property('n').eql(1);
    });
    it('Should delete a Task', async () => {
      const taskDeleted = await DailyScrum.Interfaces.Task.remove(secondTaskId);
      expect(taskDeleted).to.has.property('result');
      expect(taskDeleted.result).to.has.property('ok').eql(1);
      expect(taskDeleted.result).to.has.property('n').eql(1);
    });
    it('Shouldn\'t delete a Task', async () => {
      const fakeId = 'testIdToFail';
      const taskDeleted = await DailyScrum.Interfaces.Task.remove(fakeId);
      expect(taskDeleted).to.has.property('result');
      expect(taskDeleted.result).to.has.property('ok').eql(1);
      expect(taskDeleted.result).to.has.property('n').eql(0);
    });
  });
});