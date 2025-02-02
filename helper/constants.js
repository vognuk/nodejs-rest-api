const Gender = {
    MALE: 'male',
    FEMALE: 'female',
    NONE: 'none',
}

const HttpCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TO_MANY_REQUESTS: 429,
}

module.exports = {
    Gender,
    HttpCode,
}
