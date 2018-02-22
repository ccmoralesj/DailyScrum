const chai = require('chai');
require('chai-as-promised');
const mongoose = require('mongoose');
const roles = require('../utils/roles');
const errors = require('../utils/errors');
const DailyScrum = require('../index');
const expect = chai.expect;

describe('Project Interface', () => {
  let firstProjectId;
  let secondProjectId;
  const firstProject = {
    name: 'Project Test',
    _creator: new mongoose.Types.ObjectId(),
    description: 'Project to test Scrumly',
  };
  const secondProject = {
    name: 'Test Project',
    _creator: new mongoose.Types.ObjectId(),
  };
  describe('Project Creation', () => {
    it('Should return a validation error CREATOR_ID_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Project.create({});
      } catch (e) {
        expect(e.message).to.be.eql(errors.CREATOR_ID_REQUIRED);
      }
    });
    it('Should return a validation error NAME_REQUIRED', async () =>{
      try {
        await DailyScrum.Interfaces.Project.create({ creatorId: firstProject._creator });
      } catch (e) {
        expect(e.message).to.be.eql(errors.NAME_REQUIRED);
      }
    });
    it('Should create a Project', async () => {
      const newProject = await DailyScrum.Interfaces.Project.create({
        name: firstProject.name,
        description: firstProject.description,
        creatorId: firstProject._creator,
      });
      expect(newProject).to.has.property('id');
      firstProjectId = newProject.id;
      expect(newProject).to.has.property('name').eql(firstProject.name);
      expect(newProject).to.has.property('description').eql(firstProject.description);
      expect(newProject).to.has.property('_creator').eql(firstProject._creator);
    });
    it('Should create another Project', async() => {
      const newProject = await DailyScrum.Interfaces.Project.create({
        name: secondProject.name,
        creatorId: secondProject._creator,
      });
      expect(newProject).to.has.property('id');
      secondProjectId = newProject.id;
      expect(newProject).to.has.property('name').eql(secondProject.name);
      expect(newProject).to.has.property('_creator').eql(secondProject._creator);
    });
  });
  describe('Project Read', () => {
    it('Should read two projects', async () => {
      const projects = await DailyScrum.Interfaces.Project.read();
      expect(projects).to.be.an('Array').of.lengthOf(2);
      expect(projects[0]).to.has.property('name').eql(firstProject.name);
      expect(projects[0]).to.has.property('description').eql(firstProject.description);
      expect(projects[1]).to.has.property('name').eql(secondProject.name);
    });
    it('Should find a specific project', async() => {
      const projectFound = await DailyScrum.Interfaces.Project.readById(firstProjectId);
      expect(projectFound).to.has.property('id').eql(firstProjectId);
      expect(projectFound).to.has.property('name').eql(firstProject.name);
      expect(projectFound).to.has.property('description').eql(firstProject.description);
    });
    it('Shouldn\'t find a project', async () => {
      const fakeId = 'testIdToFail';
      const projectNotFound = await DailyScrum.Interfaces.Project.readById(fakeId);
      expect(projectNotFound).to.be.null;
    });
  });
  describe('Project Update', () => {
    it('Should update a Project', async () => {
      const testDescription = 'Another Test Description';
      const updated = await DailyScrum.Interfaces.Project.update({ id: secondProjectId, description: testDescription });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(1);
      expect(updated).to.has.property('n').eql(1);

      const projectFound = await DailyScrum.Interfaces.Project.readById(secondProjectId);
      expect(projectFound).to.has.property('id').eql(secondProjectId);
      expect(projectFound).to.has.property('name').eql(secondProject.name);
      expect(projectFound).to.has.property('description').eql(testDescription);
    });
    it('Shouldn\'t update a Project', async () => {
      const fakeId = 'testIdToFail';
      const testDescription = 'Another Test Description';
      const updated = await DailyScrum.Interfaces.Project.update({ id: fakeId, description: testDescription });
      expect(updated).to.has.property('ok').eql(1);
      expect(updated).to.has.property('nModified').eql(0);
      expect(updated).to.has.property('n').eql(0);
    });
    it('should add two toDo\'s to a project', async () => {
      const testToDos = ['some test ToDo', 'some ToDo test'];
      const projectWithToDoAdded = await DailyScrum.Interfaces.Project.addToDo({ projectId: firstProjectId, toDos: testToDos });
      expect(projectWithToDoAdded).to.has.property('id').eql(firstProjectId);
      expect(projectWithToDoAdded).to.has.property('name').eql(firstProject.name);
      expect(projectWithToDoAdded).to.has.property('description').eql(firstProject.description);
      expect(projectWithToDoAdded).to.has.property('toDo').eql(testToDos);
    });
    it('should remove a ToDo to a project', async () => {
      const testToDoToRemove = ['some test ToDo'];
      const testToDo = ['some ToDo test'];
      const projectWithToDoAdded = await DailyScrum.Interfaces.Project.removeToDo({ projectId: firstProjectId, toDos: testToDoToRemove });
      expect(projectWithToDoAdded).to.has.property('id').eql(firstProjectId);
      expect(projectWithToDoAdded).to.has.property('toDo').eql(testToDo);
      expect(projectWithToDoAdded).to.has.property('name').eql(firstProject.name);
      expect(projectWithToDoAdded).to.has.property('description').eql(firstProject.description);
    });
  });
  describe('Project Utils', () => {
    describe('isCreator function', () => {
      it('Should return isCreator = true', async () => {
        const isCreator = await DailyScrum.Interfaces.Project.isCreator({ projectId: firstProjectId, possibleCreatorId: firstProject._creator });
        expect(isCreator).to.be.eql(true);
      });
      it('Should return isCreator = false', async () => {
        const fakeId = 'testIdToFail';
        const isCreator = await DailyScrum.Interfaces.Project.isCreator({ projectId: firstProjectId, possibleCreatorId: fakeId });
        expect(isCreator).to.be.eql(false);
      });
    });
  });
  describe('Project Delete', () => {
    it('Should delete a Project', async () => {
      const projectDeleted = await DailyScrum.Interfaces.Project.remove(firstProjectId);
      expect(projectDeleted).to.has.property('ok').eql(1);
      expect(projectDeleted).to.has.property('n').eql(1);
    });
    it('Should delete a Project', async () => {
      const projectDeleted = await DailyScrum.Interfaces.Project.remove(secondProjectId);
      expect(projectDeleted).to.has.property('ok').eql(1);
      expect(projectDeleted).to.has.property('n').eql(1);
    });
    it('Shouldn\'t delete a Project', async () => {
      const fakeId = 'testIdToFail';
      const projectDeleted = await DailyScrum.Interfaces.Project.remove(fakeId);
      expect(projectDeleted).to.has.property('ok').eql(1);
      expect(projectDeleted).to.has.property('n').eql(0);
    });
  });
});