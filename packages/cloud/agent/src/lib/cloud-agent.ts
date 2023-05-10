import { feathers } from "@feathersjs/feathers"
import { services } from "@magickml/server-core"

export const app = feathers();
app.configure(services)
