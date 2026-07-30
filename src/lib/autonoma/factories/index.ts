// One factory per model Autonoma can seed. Add an entry here whenever a new
// model is added to database/schema.sql — see the "Autonoma test data" note in
// CLAUDE.md.

import { subscribers } from '@/lib/autonoma/factories/subscribers';

export const factories = { subscribers };
