// import request from 'supertest';
const request = require('supertest');
// import '@babel/polyfill';
// import app from './app';
const app = require('./app')

describe('API', () => {

  describe('GET /api/v1/notes', () => {
    
    it('should return a status of 200', () => {
      const response = request(app).get('/api/v1/notes');
      expect(response.statusCode).toBe(200);
    });
  });
});