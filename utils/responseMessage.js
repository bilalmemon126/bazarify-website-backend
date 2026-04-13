export const successMessage = (res, message, data) => {
    return res.status(200).send({
        status: 1,
        message: message,
        data: data
    })
}

export const errorMessage = (res, statusCode, message, data) => {
    return res.status(statusCode).send({
        status: 0,
        message: message,
        data: data
    })
}