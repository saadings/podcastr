import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, _) => {
    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});
