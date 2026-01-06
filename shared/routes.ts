import { z } from 'zod';
import { insertPredictionSchema, predictions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  predictions: {
    create: {
      method: 'POST' as const,
      path: '/api/predictions',
      input: z.object({ 
        minesCount: z.number().min(1).max(24) 
      }),
      responses: {
        201: z.object({
          predictedSpots: z.array(z.number())
        }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
