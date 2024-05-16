import { envs } from "../configs/env";

export function verifyToken(ctx: { status?: any; body?: any; params?: any; }, next: () => any) {
  const { params } = ctx;
  if (params.token !== envs.token) {
    ctx.status = 401;
    ctx.body = { status: 401, message: "Unauthorized" };
    return;
  }
  return next();
};

export async function errorHandler(ctx: { status: number; body: { status: number; message: any; }; }, next: () => any) {
  try {
    await next();
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { status: 500, message: error?.message };
  }
};