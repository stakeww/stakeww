import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type PredictionResponse = z.infer<typeof api.predictions.create.responses[201]>;

export function useCreatePrediction() {
  return useMutation({
    mutationFn: async (minesCount: number) => {
      // Validate input locally just in case
      const validatedInput = api.predictions.create.input.parse({ minesCount });

      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Invalid mines count. Please choose between 1 and 24.");
        }
        throw new Error("Failed to get prediction");
      }

      // Parse response with Zod to ensure type safety
      return api.predictions.create.responses[201].parse(await res.json());
    },
  });
}
