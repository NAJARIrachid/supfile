const { z } = require('zod');

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  avatar: z.string().url().nullable().optional(),
});

module.exports = { updateProfileSchema };
