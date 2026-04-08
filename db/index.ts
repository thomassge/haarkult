import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { getBookingEnv } from "@/lib/booking/env";

const { DATABASE_URL } = getBookingEnv();
const client = neon(DATABASE_URL);

export const db = drizzle({ client, schema });

export { schema };
