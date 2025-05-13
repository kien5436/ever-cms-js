import { z, ZodIssue } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'staging']),
  PORT: z.coerce.number().int().positive().default(8080),
  MONGO_INITDB_ROOT_USERNAME: z.string().min(1),
  MONGO_INITDB_ROOT_PASSWORD: z.string().min(1),
  MONGO_INITDB_DATABASE: z.string().min(1),
  MONGO_CONNECTION_STRING: z.string().url().includes('mongodb://'),
});

export type EnvVars = z.infer<typeof envSchema>;

class EnvError extends Error {

  constructor(issue: ZodIssue) {

    const message = `Invalid environment variable ${issue.path[0]}: ${issue.message}. Make sure you have defined it .env file (see .env.example for help)`;

    super(message);
  }
}

export function validate(env: EnvVars) {

  const result = envSchema.safeParse(env);

  if (result.success)
    return result.data;

  throw new EnvError(result.error.issues[0]);
}
