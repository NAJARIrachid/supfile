const { z } = require('zod');

const createShareSchema = z
  .object({
    fileId: z.string().uuid().optional(),
    folderId: z.string().uuid().optional(),
    password: z.string().min(4).optional(),
    expiresAt: z.string().datetime().optional(),
    targetUserId: z.string().uuid().optional(), // partage direct dossier → utilisateur
  })
  .refine((data) => data.fileId || data.folderId, {
    message: 'fileId ou folderId est requis',
  });

module.exports = { createShareSchema };
