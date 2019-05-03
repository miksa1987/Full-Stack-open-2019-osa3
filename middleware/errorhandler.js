

const errorHandler = (error, response, request, next) => {
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'Name must be unique!' })
    }

    next(error)
}

module.exports = errorHandler