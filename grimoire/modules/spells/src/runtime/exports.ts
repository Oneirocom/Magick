// @ts-ignore
import { handlers as spells } from "#spells-virtual/definitions";

import type { BaseVirtualHandler } from "@gtc-nova/kit/runtime";
import type { Spell } from "../types";

export const getVirtualSpells = (): BaseVirtualHandler<Spell>[] => spells;