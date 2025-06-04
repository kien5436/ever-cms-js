import { z, ZodIssue } from 'zod';

const domainSchema = z.string().refine((value) => /https?:\/\/([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[/\d\w.-]*)*(?:[?])*(.+)*/.test(value.trim()));
const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'staging']),
  PORT: z.coerce.number().int().positive().default(8080),
  DOMAIN: domainSchema,
  MONGO_INITDB_ROOT_USERNAME: z.string().trim().min(1),
  MONGO_INITDB_ROOT_PASSWORD: z.string().trim().min(1),
  MONGO_INITDB_DATABASE: z.string().trim().min(1),
  MONGO_CONNECTION_STRING: z.string().url().startsWith('mongodb://').trim(),
  REDIS_CONNECTION_STRING: z.string().url().startsWith('redis://').trim(),
  REDIS_PASSWORD: z.string().min(1),
  CORS_ORIGIN: z.string().min(1).superRefine((value, ctx) => {

    if ('*' === value.trim()) return;

    const origins = value.split(',');

    for (const origin of origins)
      if (!domainSchema.safeParse(origin).success)
        ctx.addIssue({
          code: 'custom',
          message: `Invalid domain format: ${origin}`,
        });
  }),
  JWT_SECRET: z.string().trim().min(1),
  JWT_EXPIRATION: z.string().trim().min(1),
  JWT_REFRESH_SECRET: z.string().trim().min(1),
  JWT_REFRESH_EXPIRATION: z.string().trim().min(1),
  COOKIE_SECRET: z.string().trim().min(1),
  COOKIE_EXPIRATION: z.coerce.number().int().positive(),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().trim().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SEED_PASSWORD: z.string().min(1),
});

export type EnvVars = z.infer<typeof envSchema>;

class EnvError extends Error {

  constructor(issue: ZodIssue) {

    const message = `Invalid environment variable ${issue.path[0]}: ${issue.message}. Make sure you have correctly defined it in .env file (see .env.example for help)`;

    super(message);
  }
}

export function validate(env: EnvVars) {

  const result = envSchema.safeParse(env);

  if (result.success)
    return result.data;

  throw new EnvError(result.error.issues[0]);
}
