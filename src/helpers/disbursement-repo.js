const fs = require("fs");

let disbursements = require("../data/disbursements.json");

export const disbursementRepo = {
  getAll: () => disbursements,
  getById: (id) => disbursements.find((x) => x.id.toString() === id.toString()),
  find: (x) => disbursements.find(x),
  create,
};

function create(disbursement) {
  // generate new user id
  disbursement.id = disbursements.length
    ? Math.max(...disbursements.map((x) => x.id)) + 1
    : 1;

  // set date created and updated
  disbursement.createdAt = new Date().toISOString();
  disbursement.updatedAt = new Date().toISOString();

  // add and save user
  disbursements.push(disbursement);
  saveData();
}

function saveData() {
  fs.writeFileSync(
    "../data/disbursements.json",
    JSON.stringify(disbursements, null, 4)
  );
}
