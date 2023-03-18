const fs = require("fs");

let projects = require("../data/projects.json");

export const projectRepo = {
  getAll: () => projects,
  getById: (id) => projects.find((x) => x.id.toString() === id.toString()),
  find: (x) => projects.find(x),
  create,
};

function create(project) {
  // generate new user id
  project.id = projects.length ? Math.max(...projects.map((x) => x.id)) + 1 : 1;

  // set date created and updated
  project.createdAt = new Date().toISOString();
  project.updatedAt = new Date().toISOString();

  // add and save user
  projects.push(project);
  saveData();
}

function saveData() {
  fs.writeFileSync("../data/projects.json", JSON.stringify(projects, null, 4));
}
