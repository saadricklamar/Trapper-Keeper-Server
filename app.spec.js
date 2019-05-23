import request from 'supertest';
import '@babel/polyfill';
import app from './app';


describe('API', () => {

  describe('GET /api/v1/notes', () => {
    
    it('should return a status of 200', () => {
      const response = request(app).get('/api/v1/notes');
      expect(response.statusCode).toBe(200);
    });
  });
});