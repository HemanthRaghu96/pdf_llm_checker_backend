export function validateEnvironment() {
  const requiredEnvVars = ["GEMINI_API_KEY"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  console.log("Environment variables validated successfully");
}
