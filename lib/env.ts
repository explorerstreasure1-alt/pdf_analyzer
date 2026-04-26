/**
 * Environment variable validation
 * This file validates required environment variables at build time
 */

const requiredEnvVars = {
  GROQ_API_KEY: {
    description: 'Groq API key for AI analysis',
    required: true,
  },
} as const;

type EnvVarName = keyof typeof requiredEnvVars;

export function validateEnvVars(): void {
  const missing: string[] = [];

  for (const [name, config] of Object.entries(requiredEnvVars)) {
    if (config.required && !process.env[name]) {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please add them to your .env.local file or deployment environment.`
    );
  }
}

// Validate at module load time in production
if (process.env.NODE_ENV === 'production') {
  validateEnvVars();
}

export function getEnvVar(name: EnvVarName): string {
  const value = process.env[name];
  
  if (!value && requiredEnvVars[name].required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value!;
}
