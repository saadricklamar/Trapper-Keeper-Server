// import express from 'express';
const express = require('express');
// import cors from 'cors';
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.locals.notes = [
  {title: 'test', task: [{name: 'task', id: 1, complete: false}], id: 2}
];

app.get('/api/v1/notes', (req, res) => {
  res.status(200).json(app.locals.notes)
});

app.post('/api/v1/notes', (req, res) => {
  const { title, task, id } = req.body;
  if (!title || !task) return res.status(422).json('Please provide a title and task');
  const newNote = {
    id: Date.now(),
    ...req.body
  };
  app.locals.notes.push(newNote);
  res.status(201).json(newNote);
})

module.exports = app;