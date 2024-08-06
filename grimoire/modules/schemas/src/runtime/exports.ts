// @ts-ignore
import { handlers as schemas } from "#schemas-virtual/definitions";

import type { BaseVirtualHandler } from "@gtc-nova/kit/runtime";
import type { SchemaDefinition } from "../types";

export const getVirtualSchemas = (): BaseVirtualHandler<{ key: string; definition: SchemaDefinition }>[] => schemas;