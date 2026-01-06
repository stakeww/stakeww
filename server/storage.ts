import { predictions, type Prediction, type InsertPrediction } from "@shared/schema";

export interface IStorage {
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
}

export class MemStorage implements IStorage {
  private predictions: Map<number, Prediction>;
  private currentId: number;

  constructor() {
    this.predictions = new Map();
    this.currentId = 1;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentId++;
    const prediction: Prediction = { 
      ...insertPrediction, 
      id, 
      createdAt: new Date() 
    };
    this.predictions.set(id, prediction);
    return prediction;
  }
}

export const storage = new MemStorage();
