// function authorizeAdmin(req, res, next) {
//   // Check if the user has the admin role
//   if (req.user.role !== "admin") {
//     // Return an error or redirect to unauthorized page
//     return res.status(403).json({ error: "Forbidden" });
//   }

//   // User is authorized as an admin, proceed to the next middleware
//   next();
// }
const isAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    return next();
  }

  // If user is not an admin, redirect or send an error response
  res.status(401).send("akses di tolak");
};

module.exports = isAdmin;
