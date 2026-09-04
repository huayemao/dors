import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

let prisma: PrismaClient;

export const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.IS_BUILD === "true" ||
  (typeof process !== "undefined" &&
    Array.isArray(process.argv) &&
    process.argv.some((arg) => arg.includes("build")));

function createDummyPrismaProxy(): any {
  const dummyHandler: ProxyHandler<any> = {
    get(_target, prop: string | symbol) {
      if (prop === "then") return undefined;
      if (prop === "$disconnect" || prop === "$connect") {
        return async () => {};
      }
      if (prop === "$transaction") {
        return async (arg: any) => {
          if (Array.isArray(arg)) return Promise.all(arg);
          if (typeof arg === "function") return arg(prisma);
          return [];
        };
      }
      return new Proxy((..._args: any[]) => {
        const propStr = String(prop);
        if (propStr.startsWith("findFirst") || propStr.startsWith("findUnique")) {
          return Promise.resolve(null);
        }
        if (propStr.startsWith("count")) {
          return Promise.resolve(0);
        }
        return Promise.resolve([]);
      }, dummyHandler);
    },
    apply(_target, _thisArg, _args) {
      return Promise.resolve([]);
    },
  };
  return new Proxy(() => {}, dummyHandler);
}

if (isBuildPhase) {
  prisma = createDummyPrismaProxy();
} else if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    errorFormat: "minimal",
  });
} else {
  globalThis["prisma"] =
    globalThis["prisma"] ||
    new PrismaClient({
      errorFormat: "pretty",
    });
  prisma = globalThis["prisma"];
}

export default prisma;
