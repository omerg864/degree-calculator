

const sanitizeMiddleware = (req, res, next) => {
    // sanitize req.body
    const body = req.body;
    for (const key in body) {
        if (Object.hasOwnProperty.call(body, key)) {
            const value = sanitizeValue(body[key]);
            body[key] = value;
        }
    }
    // sanitize req.params
    const params = req.params;
    for (const key in params) {
        if (Object.hasOwnProperty.call(params, key)) {
            const value = sanitizeValue(params[key]);
            params[key] = value;
        }
    }
    // sanitize req.query
    const query = req.query;
    for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
            const value = sanitizeValue(query[key]);
            query[key] = value;
        }
    }
    next();
}


const sanitizeValue = (value) => {
    // remove any $ or . characters from the value
    if (typeof value !== 'string') {
        return value;
    }
    value = value.replace(/\./g, '');
    value = value.replace(/\$/g, '');
    return value;
}

export default sanitizeMiddleware;