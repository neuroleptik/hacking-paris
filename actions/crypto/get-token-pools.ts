import { authActionClient } from '@/actions/safe-action';

export const getTokenPools = authActionClient
  .metadata({ actionName: 'getTokenPools' })
  .action(async ({ ctx: { session } }) => {
    try {
      // TODO: Implement token pool creation logic here
      // This is a placeholder that simulates success
      // get the adress from the user_root of the organization
      // const userRoot = await prisma.user_root.findFirst({
      //   where: {
      //     organization_id: session.user.organization_id
      //   }
      // });
      return { success: true, data: [] };
    } catch (error) {
      return {
        serverError: {
          message: "Couldn't create token pool"
        }
      };
    }
  });
