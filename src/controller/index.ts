import Manager from "../services/manager";

export async function runRouteHandler(ctx: { params: { key: any; }; body: any; }) {
  const { key } = ctx.params;
  ctx.body = await Manager.run(key);
}

export async function startRouteHandler(ctx: any) {
  const { key } = ctx.params;
  ctx.body = await Manager.startContainerByName(key);
}

export async function stopRouteHandler(ctx: any) {
  const { key } = ctx.params;
  await Manager.stopContainerByName(key);
  ctx.body = { status: 200, message: 'Container stopped successfully' };
}

export async function deleteRouteHandler(ctx: any) {
  const { key } = ctx.params;
  await Manager.deleteContainerByName(key);
  ctx.body = { status: 200, message: 'Container deleted successfully' };
}

export async function listRouteHandler(ctx: any) {
  ctx.body = await Manager.listContainers();
}
