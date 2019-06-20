import express from "express"; //importing express
import cors from "cors"; //importing cors

const app = express(); //initilizing express by assigning to variable of app

app.use(cors()); //invoking cors with app
app.use(express.json()); //invoking express with json

app.locals.notes = []; // dummy array of notes

// this is a function that is handling a get request to '/api/v1/notes'.
// the second parameter is a call back function that takes in a request and response.
// in this example, when the response status is 200, it sends the stored notes back
// to the client

app.get("/api/v1/notes", (req, res) => {  
  res.status(200).json(app.locals.notes);
});

// this is a function that is hangling a get request for a specfic note '/:id'
// we destructure the id from the req.params
// then create a variable note, which is the note to be found, and dive into the
// array of local notes looking for the note.id that matches our destructured id
// if no note is found with that id, then we return an error status of no note found
// if succesful we return that note and response that request has succeeded. 

app.get("/api/v1/notes/:id", (req, res) => {
  const { id } = req.params;
  const note = app.locals.notes.find(note => note.id == id);
  if (!note) return res.status(404).json("Note not found");
  return res.status(200).json(note);
});

// this is a function that allows us to create a note
// we destructure the title and tasks of the note from req.body
// if the note does not have a title or tasks, then we send an error message
// requesting that the user fill in both
// we then create a newNote with an id and the req.body (title and tasks)
// then we push our newNote into the array of locals.notes
// and send a response status that says the request has been fulfilled and resulted
// in one or more reserouces being created. 

app.post("/api/v1/notes", (req, res) => {
  const { title, tasks } = req.body;
  if (!title || !tasks)
    return res.status(422).json("Please provide a title and task");
  const newNote = {
    id: Date.now(),
    ...req.body
  };
  app.locals.notes.push(newNote);
  res.status(201).json(newNote);
});

// this is a function that allows us to edit a specific note
// we destructure title and task from req.body
// if no title or task is provided, we ask the client to provide one
// we find that specific note according to the id
// if note is not found, we return an error of 'Note not found'
// if note is found, we create our updated note and splice it into the array
// and send a response status of 204 meaning the server has succesfully fulfilled the request

app.put("/api/v1/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, task } = req.body;
  if (!title || !task)
    return res.status(422).json("Please provide a title and task");
  const noteIndex = app.locals.notes.findIndex(note => note.id === id);
  if (noteIndex === -1) return res.status(404).json("Note not found");
  const updatedCard = { id, title, task };
  app.locals.notes.splice(noteIndex, 1, updatedCard);
  return res.sendStatus(204);
});

// this is a function that allows us to delete a specific note
// we assign id to the req.params.id
// we once again find the note 
// if note is not found, then we send an error message of note not found
// if note is found, then we splice (remove) that specific note from app.locals.notes
// and send a response status of 204 meaning the server has succesfully fulfilled the request

app.delete("/api/v1/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = app.locals.notes.findIndex(note => note.id === id);
  if (noteIndex === -1) return res.status(404).json("Note does not exist");
  app.locals.notes.splice(noteIndex, 1);
  return res.sendStatus(204);
});

export default app;
