const request = require('supertest');
const Task = require('../src/models/task');
const app = require("../src/app");

const {
    userOne,
    userOneId,
    userTwoId,
    userTwo,
    taskOne,
    taskThree,
    taskTwo,
    setupDatabase,
  } = require("./fixtures/db");
  

beforeEach(setupDatabase);

test('should create task', async () =>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'this is a test'
        }).expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.done).toEqual(false);
})

test('should get the tasks for the user', async ()=>{
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
})


test('should not delete other user task', async () =>{
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})