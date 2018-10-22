// middleware for doing role-based permissions
function adminAccess(req, res, next) {
         if (req.userInfo.id && (req.userInfo.role === "admin"))
             next(); // role is allowed, so continue on the next middleware
         else {
             res.status(403).json({ access: false, message: "Admin access required"});
         }
}

module.exports = adminAccess;
