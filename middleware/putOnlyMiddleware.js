module.exports = (req, res, next) => {
    // only post method is accepted
    if (req.method === 'PUT') {
        next();
    } else {
      res
        .status(500)
        .json({ message: 'HTTP method not valid only PUT Accepted' });
    }
};
