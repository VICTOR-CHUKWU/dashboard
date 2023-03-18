const fs = require("fs");

let contractors = require("../data/contractors.json");

export const contractorRepo = {
  getAll: () => contractors,
  getById: (id) => contractors.find((x) => x.id.toString() === id.toString()),
  find: (x) => contractors.find(x),
  create,
};

function create(contractor) {
  // generate new user id
  contractor.id = contractors.length
    ? Math.max(...contractors.map((x) => x.id)) + 1
    : 1;

  // set date created and updated
  contractor.createdAt = new Date().toISOString();
  contractor.updatedAt = new Date().toISOString();

  // add and save user
  contractors.push(contractor);
  saveData();
}

function saveData() {
  fs.writeFileSync(
    "../data/contractors.json",
    JSON.stringify(contractors, null, 4)
  );
}
