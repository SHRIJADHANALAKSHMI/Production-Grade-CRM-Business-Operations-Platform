const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        data: process.env.NODE_ENV === "production" ? null : { stack: err.stack },
    });
};

export { errorHandler };
