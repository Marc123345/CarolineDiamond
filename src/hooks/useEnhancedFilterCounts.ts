// src/config/filterConfig.ts

export type MetalColor = 'White Gold' | 'Yellow Gold' | 'Rose Gold';
export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
export type Certification = 'GIA' | 'HRD' | 'IGI';

export interface CaratWeight {
  min: number;
  max?: number;
  label: string;
}

export interface ProductFilters {
  jewelryCategory?: string[];
  ringStyle?: string;
  shapes?: string[];
  metalColors?: string[];
  stoneType?: string;
  diamondOrigin?: string;
  gemstoneVariant?: string;
  caratWeights?: string[];
  clarityGrades?: string[];
  certifications?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  [key: string]: any;
}

export const METAL_COLORS: MetalColor[] = ['White Gold', 'Yellow Gold', 'Rose Gold'];

export const CARAT_WEIGHTS: CaratWeight[] = [
  { min: 0.30, max: 0.39, label: '0.30 ct' },
  { min: 0.50, max: 0.59, label: '0.50 ct' },
  { min: 1.00, max: 1.24, label: '1.00 ct' },
  { min: 1.50, max: 1.99, label: '1.50 ct' },
  { min: 2.00, max: 99.99, label: '2.00+ ct' },
];

export const RING_STYLES = ['Solitaire', 'Halo', 'Solitaire + Side Diamonds', 'Halo + Side Diamonds', 'Vintage', 'Pavé'];
export const ALL_SHAPES = ['Round', 'Oval', 'Princess', 'Pear', 'Marquise', 'Emerald', 'Cushion', 'Radiant', 'Asscher', 'Heart'];
export const DIAMOND_ORIGINS = ['Natural', 'Lab-Grown'];
export const GEMSTONE_VARIANTS = ['Sapphire', 'Emerald', 'Ruby', 'Morganite'];
export const CLARITY_GRADES: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
export const CERTIFICATIONS: Certification[] = ['GIA', 'HRD', 'IGI'];