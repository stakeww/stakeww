import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCreatePrediction() {
  return useMutation({
    mutationFn: async (minesCount: number) => {
      // Simulate API delay locally for React-only build
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const allSpots = Array.from({ length: 25 }, (_, i) => i);
      for (let i = allSpots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSpots[i], allSpots[j]] = [allSpots[j], allSpots[i]];
      }
      
      const spotsCount = 25 - Math.min(24, minesCount);
      const predictedSpots = allSpots.slice(0, spotsCount);
      
      return { predictedSpots };
    },
  });
}
