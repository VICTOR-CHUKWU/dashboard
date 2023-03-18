const fs = require("fs");

let installations = require("../data/installations.json");

export const installationRepo = {
  getAll: () => installations,
  getById: (id) => installations.find((x) => x.id.toString() === id.toString()),
  find: (x) => installations.find(x),
  create,
};

function create(installation) {
  // generate new user id
  installation.id = installations.length
    ? Math.max(...installations.map((x) => x.id)) + 1
    : 1;

  // set date created and updated
  installation.createdAt = new Date().toISOString();
  installation.updatedAt = new Date().toISOString();

  // add and save user
  installations.push(installation);
  saveData();
}

function saveData() {
  fs.writeFileSync(
    "../data/installations.json",
    JSON.stringify(installations, null, 4)
  );
}
