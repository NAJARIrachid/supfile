const userService = require('../services/user.service');

async function updateMe(req, res) {
  const user = await userService.updateProfile(req.user.id, req.validatedBody);
  res.json({ success: true, data: user });
}

module.exports = { updateMe };
