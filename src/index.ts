import {buildResponse} from './response'
import {Temperature} from './types'

export async function handleRequest(request: Request, env: Bindings): Promise<Response> {
  // Match route against pattern /:name/*action
  const url = new URL(request.url);
  const match = /\/(?<name>[^/]+)(?<action>.*)/.exec(url.pathname);
  if (!match?.groups) {
    // If we didn't specify a name, default to "test"
    return Response.redirect(`${url.origin}/test/increment`, 302);
  }

  // Forward the request to the named Durable Object...
  // const { COUNTER } = env;
  // const id = COUNTER.idFromName(match.groups.name);
  // const stub = COUNTER.get(id);
  // ...removing the name prefix from URL

  const { KV_NAMESPACE } = env;
  await KV_NAMESPACE.put('2023-03-31T11:00:00', (Math.random()*10+37).toFixed(2))
  const keys = await KV_NAMESPACE.list()
  const temps: Temperature[] = await Promise.all(keys.keys.map(async k => ({time: k.name, temp: await KV_NAMESPACE.get(k.name)|| ''})))

  url.pathname = match.groups.action;
  const resp = buildResponse(temps)
  return resp
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

// Make sure we export the Counter Durable Object class
// export { Counter } from "./counter";
export default worker;
