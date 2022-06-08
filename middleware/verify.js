module.exports = (req, res, next) => {
  try {
    const { isVerified } = req.user;
    if (isVerified) return next();
    return res
      .status(404)
      .json({ success: false, message: `user not verified` });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};
