import request from "supertest";
import "@babel/polyfill";
import app from "./app";

describe("API", () => {
  let notes;
  beforeEach(() => {
    notes = [
      {
        id: 1,
        title: "grocery list",
        task: [{ task: "task", id: 1, complete: false }]
      },
      {
        id: 2,
        title: "shopping list",
        task: [{ task: "task", id: 1, complete: false }]
      }
    ];
    app.locals.notes = notes;
  });
  describe("GET /api/v1/notes", () => {
    it("should return a status of 200", () => {
      request(app)
        .get("/api/v1/notes")
        .then(res => {
          expect(res.statusCode).toBe(200);
        });
    });
    it("should return an array of notes", async () => {
      const response = await request(app).get("/api/v1/notes");
      expect(response.body).toEqual(notes);
    });
  });
  describe("GET /api/v1/notes/:id", () => {
    it("should return a status of 404", async () => {
      const response = await request(app).get("/api/v1/notes/10");
      expect(response.status).toBe(404);
    });
    it("should return an error message", async () => {
      const response = await request(app).get("/api/v1/notes/10");
      expect(response.body).toEqual("Note not found");
    });
    it("should return a status of 200", async () => {
      const response = await request(app).get("/api/v1/notes/1");
      expect(response.status).toBe(200);
    });
    it("should return a note", async () => {
      const response = await request(app).get("/api/v1/notes/1");
      expect(response.body).toEqual(notes[0]);
    });
  });
  describe("POST /api/v1/notes/", () => {
    it("should return a status of 422", async () => {
      let badNote = { list: "groceries" };
      const response = await request(app)
        .post("/api/v1/notes")
        .send(badNote);
      expect(response.statusCode).toBe(422);
    });
    it("should return an error message", async () => {
      let badNote = { list: "groceries" };
      const response = await request(app)
        .post("/api/v1/notes")
        .send(badNote);
      expect(response.body).toEqual("Please provide a title and task");
      expect(app.locals.notes.length).toBe(2);
    });
    it("should return a status of 201", async () => {
      const goodNote = {
        title: "laundry",
        tasks: [{ task: "task", id: 1, complete: false }]
      };
      const response = await request(app)
        .post("/api/v1/notes")
        .send(goodNote);
      expect(response.status).toBe(201);
    });
    it("should return a new note if ok", async () => {
      const goodNote = {
        title: "laundry",
        tasks: [{ task: "task", id: 1, complete: false }]
      };
      Date.now = jest.fn().mockImplementation(() => 3);
      expect(app.locals.notes.length).toEqual(2);

      const response = await request(app)
        .post("/api/v1/notes")
        .send(goodNote);
      expect(response.body).toEqual({ id: 3, ...goodNote });
      expect(app.locals.notes.length).toEqual(3);
    });
  });
  describe("PUT /api/v1/notes/:id", () => {
    it("should return a status of 204 if card succesfully updated", async () => {
      const newNoteInfo = {
        title: "fishing list",
        task: [{ task: "get bread", id: 1, complete: false }]
      };
      const response = await request(app)
        .put("/api/v1/notes/1")
        .send(newNoteInfo);
      expect(response.status).toBe(204);
    });
    it("should update update the note if successful", async () => {
      const newNoteInfo = {
        title: "fishing list",
        task: [{ task: "get bread", id: 1, complete: false }]
      };
      const expected = [{ id: 1, ...newNoteInfo }, notes[1]];
      expect(app.locals.notes).toEqual(notes);
      const response = await request(app)
        .put("/api/v1/notes/1")
        .send(newNoteInfo);
      expect(app.locals.notes).toEqual(expected);
    });
    it("should return a status of 422 and error message if there is no title", async () => {
      const titleLessNote = {
        title: "",
        task: [{ name: "get bread", id: 1, complete: false }]
      };
      const response = await request(app)
        .put("/api/v1/notes/1")
        .send(titleLessNote);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide a title and task");
    });
    it("should return a status of 422 and error message if there are no tasks", async () => {
      const taskLessNote = { title: "shopping list", task: "" };
      const response = await request(app)
        .put("/api/v1/notes/1")
        .send(taskLessNote);
      expect(response.status).toBe(422);
      expect(response.body).toBe("Please provide a title and task");
    });
  });
  describe("DELETE /api/v1/notes/:id", () => {
    it("should return a status of 204 if card is succesfully deleted", async () => {
      const response = await request(app).delete("/api/v1/notes/1");
      expect(response.status).toBe(204);
    });
    it("should delete the card if it exists", async () => {
      const expected = [notes[1]];
      expect(app.locals.notes.length).toBe(2);
      await request(app).delete("/api/v1/notes/1");
      expect(app.locals.notes.length).toBe(1);
      expect(app.locals.notes).toEqual(expected);
    });
    it("should return a 404 if the note does not exist", async () => {
      const response = await request(app).delete("/api/v1/notes/3");
      expect(response.status).toBe(404);
    });
    it("should return a note does not exist message if note not found", async () => {
      const response = await request(app).delete("/api/v1/notes/3");
      expect(response.body).toBe("Note does not exist");
    });
  });
});
