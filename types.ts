/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

export interface SIGatewayMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: string;
  durationMs?: number;
  tokens?: {
    prompt: number | null;
    candidates: number | null;
    total: number | null;
  };
  errorCode?: string;
}

export interface NEOObject {
  id: string;
  name: string;
  estimatedDiameterMeters: { min: number; max: number };
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  missDistanceKm: string;
  relativeVelocityKmh: string;
  orbitingBody: string;
  status: string;
  daacReference: string;
}

export interface EarthdataApp {
  id: string;
  name: string;
  category: 'Discovery' | 'Processing' | 'DAAC Access' | 'Infrastructure' | 'UAT / SIT';
  env: 'PROD' | 'UAT' | 'SIT' | 'Local' | 'Decommissioned';
  description: string;
  url?: string;
  protocol?: string;
}
