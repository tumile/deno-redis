import { connect, Redis, RedisConnectOptions } from "../redis.ts";
import { delay } from "../vendor/https/deno.land/std/async/mod.ts";

type TestFunc = () => void | Promise<void>;
type TestServer = {
  path: string;
  process: Deno.Process;
};

export class TestSuite {
  private tests: { name: string; func: TestFunc }[] = [];
  private beforeEachs: TestFunc[] = [];
  private afterAlls: TestFunc[] = [];
  private promises = [] as Promise<void>[];

  constructor(private prefix: string) {}

  beforeEach(func: TestFunc): void {
    this.beforeEachs.push(func);
  }

  afterAll(func: TestFunc): void {
    this.afterAlls.push(func);
  }

  test(name: string, func: TestFunc): void {
    Deno.test(`[${this.prefix}] ${name}`, async () => {
      for (const f of this.beforeEachs) {
        await f();
      }
      await func();
    });
  }

  runTests = (): void => {
    Deno.test({
      name: `[${this.prefix}] afterAll`,
      fn: async () => {
        for (const afterAll of this.afterAlls) {
          await afterAll();
        }
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  };
}

const encoder = new TextEncoder();

export async function startRedis({
  port = 6379,
  clusterEnabled = false,
}): Promise<TestServer> {
  const path = `testdata/${port}`;

  if (!(await exists(path))) {
    Deno.mkdirSync(path);
    Deno.copyFileSync(`testdata/redis.conf`, `${path}/redis.conf`);

    let config = `dir ${path}\nport ${port}\n`;
    config += clusterEnabled ? "cluster-enabled yes" : "";

    Deno.writeFileSync(`${path}/redis.conf`, encoder.encode(config), {
      append: true,
    });
  }

  const process = Deno.run({
    cmd: ["redis-server", `testdata/${port}/redis.conf`],
    stdin: "null",
    stdout: "null",
  });

  // Ample time for server to finish startup
  await delay(500);
  return { path, process };
}

export function stopRedis(server: TestServer): void {
  Deno.removeSync(server.path, { recursive: true });
  server.process.close();
}

export function newClient(opt: RedisConnectOptions): Promise<Redis> {
  return connect(opt);
}

async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
