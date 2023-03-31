import {buildResponse} from './response'
import {Temperature} from './types'
import spacetime, {Spacetime} from 'spacetime'

export async function schedRequest(env: Bindings): Promise<Response> {
  // Match route against pattern /:name/*action
 

  const { KV_NAMESPACE } = env;
  const st = spacetime()
  const future = st.add(5, 'minutes')
  const time = new Date()
  const plusFive = time.getTime()
  .toLocaleString()
  await KV_NAMESPACE.put(future.format('nice'), (Math.random()*10+37).toFixed(2))
  const keys = await KV_NAMESPACE.list()
  const temps: Temperature[] = await Promise.all(keys.keys.map(async k => ({time: k.name, temp: await KV_NAMESPACE.get(k.name)|| ''})))

  const resp = buildResponse(temps)
  return resp
}

const worker: ExportedHandlerScheduledHandler<Bindings> = (event, env, ctx) => {
  ctx.waitUntil(schedRequest(env))
};

// Make sure we export the Counter Durable Object class
// export { Counter } from "./counter";
export default worker;
