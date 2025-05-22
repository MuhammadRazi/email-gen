/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface PrivateEnv {
    OPENAI_API_KEY: string;
  }
}