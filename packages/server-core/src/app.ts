// GENERATED 
import {
  configureManager,
  DEFAULT_PROJECT_ID,
  DEFAULT_USER_ID,
  globalsManager,
  IGNORE_AUTH,
} from "@magickml/engine";
import { authenticate } from "@feathersjs/authentication/lib/hooks";
import { feathers } from "@feathersjs/feathers";
import {
  bodyParser,
  cors,
  errorHandler,
  koa,
  parseAuthentication,
  rest,
} from "@feathersjs/koa";
import socketio from "@feathersjs/socketio";
import { dbClient } from "./dbClient";
import type { Application, HookContext } from "./declarations";
import { logError } from "./hooks";
import channels from "./sockets/channels";
import { NotAuthenticated } from "@feathersjs/errors/lib";
import { authentication } from "./auth/authentication";
import { services } from "./services";
import handleSockets from "./sockets/sockets";
import HNSWVectorDatabase from "./vectordb";

// Initialize the Feathers Koa app
const app: Application = koa(feathers());

/**
 * Euclidean distance function for the vectors
 * @param a - first vector
 * @param b - second vector
 * @returns distance between the two vectors
 */
function euclideanDistance(a: number[], b: number[]): number {
  let distance = 0;
  for (let i = 0; i < a.length; i++) {
    distance += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(distance);
}

// Vector database instance
const vectordb = new HNSWVectorDatabase<number[]>(
  "data.json",
  euclideanDistance
);

// Register globals
globalsManager.register("feathers", app);

// Application configuration settings
const port = parseInt(process.env.PORT || "3030", 10);
app.set("port", port);

const host = process.env.HOST || "localhost";
app.set("host", host);

const paginateDefault = parseInt(process.env.PAGINATE_DEFAULT || "10", 10);
const paginateMax = parseInt(process.env.PAGINATE_MAX || "50", 10);
const paginate = {
  default: paginateDefault,
  max: paginateMax,
};
app.set("paginate", paginate);

// Koa middleware
app.use(cors());
app.use(errorHandler());
app.use(parseAuthentication());
app.use(bodyParser());

// Configure app management settings
app.configure(configureManager());

// Configure authentication
if (!IGNORE_AUTH) {
  app.set("authentication", {
    secret: process.env.JWT_SECRET || "secret",
    entity: null,
    authStrategies: ["jwt"],
    jwtOptions: {
      header: { type: "access" },
      audience: "https://yourdomain.com",
      issuer: "feathers",
      algorithm: "A256GCM",
      expiresIn: "1d",
    },
  });

  app.configure(authentication);
}

// Configure services and transports
app.configure(rest());

// Configure WebSocket for the app
app.configure(
  socketio(
    {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Authorization"],
        credentials: true,
      },
    },
    handleSockets(app)
  )
);

// Configure the vector database
declare module "./declarations" {
  interface Configuration {
    vectordb: HNSWVectorDatabase<number[]>;
  }
}

app.set("vectordb", vectordb);
app.configure(dbClient);
app.configure(services);
app.configure(channels);

// Register hooks
app.hooks({
  around: {
    all: [
      logError,
      async (context, next) => {
        if (IGNORE_AUTH) return await next();
        if (context.path !== "authentication") {
          return authenticate("jwt")(context, next);
        }

        await next();
      },
      async (context: HookContext, next) => {
        const { params } = context;

        if (IGNORE_AUTH) {
          context.params.user = {
            id: DEFAULT_USER_ID,
          };
          context.params.projectId = DEFAULT_PROJECT_ID;
          return await next();
        }

        const { authentication, authenticated } = params;

        if (authenticated) {
          context.params.user = authentication.payload.user;
          context.params.projectId = authentication.payload.projectId;

          if (context?.params?.query?.projectId) {
            const projectId = context.params.query.projectId;

            if (authentication.payload.project !== projectId) {
              console.log("User not authorized to access project");
              throw new NotAuthenticated("User not authorized to access project");
            }
          }
        }

        await next();
      },
    ],
  },
  before: {
    all: [],
  },
  after: {},
  error: {},
});

// Register setup and teardown hooks
app.hooks({
  setup: [],
  teardown: [],
});

// Export the app
export { app };