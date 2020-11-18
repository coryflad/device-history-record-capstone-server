const CreateDhrService = {

    //relevant
    getCreateDhrs(db) {
        return db
            .select('*')
            .from('dhr')
    },

    getCreateDhrById(db, createDhr_id) {
        return db
            .select('*')
            .from('dhr')
            .where('dhr.id', createDhr_id)
            .first()
    },

    //relevant
    insertCreateDhr(db, newCreateDhr) {
        console.log(newCreateDhr, 'string for console log')
        return db
            .insert(newCreateDhr)
            .into('dhr')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //relevant
    updateCreateDhr(db, createDhr_id, newCreateDhr) {
        return db('dhr')
            .update(newCreateDhr, returning = true)
            .where({
                id: createDhr_id
            })
            .returning('*')
    },

    //relevant
    deleteCreateDhr(db, createDhr_id) {
        return db('dhr')
            .delete()
            .where({
                'id': createDhr_id
            })
    }
}

module.exports = CreateDhrService
