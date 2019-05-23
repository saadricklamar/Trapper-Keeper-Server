import request from 'supertest';
import '@babel/polyfill';
import app from './app';


describe('API', () => {
  let notes;
  beforeEach(() => {
    notes = [{id: 1, title: 'grocery list', task: 'get bananas'}, 
             {id: 2, title: 'shopping list', task: 'buy sweater'}
            ];
    app.locals.notes = notes;
  });
  describe('GET /api/v1/notes', async () => {
    it('should return a status of 200', () => {
      const response = await request(app).get('/api/v1/notes');
      expect(response.statusCode).toBe(200);
    });
    it('should return an array of notes', async () => {
      const response = await request(app).get('/api/v1/notes');
      expect(response.body).toEqual(notes);
    });
  });
  describe('GET /api/v1/notes/:id', async () => {
    it('should return a status of 404', async () => {
      const response = await request(app).get('/api/v1/notes/1000');
      expect(response.statusCode).toBe(404);
    })
    it('should return an error message', async () => {
      const response = await request(app).get('/api/v1/notes/1000');
      expect(response.body).toEqual('Note not found');
    })
    it('should return a status of 200', async () => {
      const response = await request(app).get('/api/v1/notes/1');
      expect(response.statusCode).toBe(200);
    });
    it('should return a note', async () => {
      const response = await request(app).get('/api/v1/notes/1');
      expect(response.body).toEqual(notes[0]);
    });
  })

  describe('POST /api/v1/notes/:id', async () => {
    it('should return a status of 422', async () => {
      let badNote = {list: 'groceries'}
      const response = await request(app).post('/api/v1/notes/1')
      .send(badNote);
      expect(request.statusCode).toBe(422);
    })
    it('should return an error message', async () => {
      let badNote = {list: 'groceries'}
      const response = await request(app).post('/api/v1/notes/1')
      .send(badNote);
      expect(request.body).toEqual('Please provide a title and task');
      expect(app.locals.notes.length).toBe(2);
    })
    it('should return a status of 201', async () => {
      const response = await request(app).post('/api/v1/notes/1').send(goodNote);
      expect(request.statusCode).toBe(201);
    });
    it('should return a new note if ok', async () => {
      const goodNote = {title: 'laundry', task: 'Go to dry cleaners'};
      Date.now = jest.fn().mockImplementation(() => 3)
      expect(app.locals.notes).toEqual([notes])

      const response = await request(app).post('/api/v1/notes/1').send(goodNote);
      expect(request.body).toEqual({id: 3, ...goodNote});
      expect(app.locals.notes).toEqual([...notes, goodNote])
    });
  });
});