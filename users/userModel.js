const db = require('../data/dbConfig');

function get(id = 0) {
    if (id) {
        return db('users').where({ id }).first();
    } else {
        return db('users');
    }
}

async function insert(user) {
    let [id] = await db('users').insert(user);
    return get(id);
}

module.exports = {
    get,
    insert
};