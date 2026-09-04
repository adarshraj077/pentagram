import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const userData = jwt.verify(token, process.env.SECRET);
    req.userId = userData.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default checkToken;
