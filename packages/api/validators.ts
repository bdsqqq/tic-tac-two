import * as z from "zod";

/**
 * Shared validators used in both the frontend and backend
 */

export const createProjectSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  url: z.string().url("Must be a valid URL").optional(),
});
export type CreateProject = z.infer<typeof createProjectSchema>;

export const renameProjectSchema = z.object({
  projectId: z.string(),
  name: z.string().min(5, "Name must be at least 5 characters"),
});
export type RenameProject = z.infer<typeof renameProjectSchema>;

export const createApiKeySchema = z.object({
  projectId: z.string(),
  name: z.string(),
  expiresAt: z.date().optional(),
});
export type CreateApiKey = z.infer<typeof createApiKeySchema>;

export const MEMBERSHIP = {
  Member: "basic_member",
  Admin: "admin",
} as const;

export const inviteOrgMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(MEMBERSHIP),
});
export type InviteOrgMember = z.infer<typeof inviteOrgMemberSchema>;

export const transferToOrgSchema = z.object({
  projectId: z.string(),
  orgId: z.string(),
});
export type TransferToOrg = z.infer<typeof transferToOrgSchema>;
