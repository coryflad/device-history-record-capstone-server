const CreateDhrService = {

    //relevant
    getCreateDhrs(db) {
        return db
            .select('*')
            .from('createDhr')
    },

    getCreateDhrById(db, createDhr_id) {
        return db
            .select('*')
            .from('createDhr')
            .where('createDhr.id', createDhr_id)
            .first()
    },

    //relevant
    insertCreateDhr(db, newCreateDhr) {
        return db
            .insert(newCreateDhr)
            .into('createDhr')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //relevant
    updateCreateDhr(db, createDhr_id, newCreateDhr) {
        return db('createDhr')
            .update(newCreateDhr, returning = true)
            .where({
                id: createDhr_id
            })
            .returning('*')
    },

    //relevant
    deleteCreateDhr(db, createDhr_id) {
        return db('createDhr')
            .delete()
            .where({
                'id': createDhr_id
            })
    }
}

module.exports = CreateDhrService
