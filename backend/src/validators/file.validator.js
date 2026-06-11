const { z } = require('zod');

const updateFileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  folderId: z.string().uuid().nullable().optional(),
});

module.exports = { updateFileSchema };
