export type ProductType = {
  id: string;
  description: string;
  imageUrl: string;
};

export type Controller = {
  id: string;
  name: string;
  active: boolean;
};

export type QualityControl = {
  id: string;
  controlRef: string;
  date: string;
  modelRef: string;
  brand: string;
  description: string;
  state: 'proto1' | 'proto2' | 'proto3' | 'proto4' | 'sms' | 'size-set' | 'pre-production' | 'production';
  color: string;
  productTypeId: string;
  controllerId: string;
  measurements: Measurement[];
  photos: Photo[];
  observations: string;
  result: 'OK' | 'NOK' | null;
};

export type Measurement = {
  id: string;
  code: string; // sigla
  description: string;
  expectedValue: number;
  actualValues: { [size: string]: number | null };
  tolerance: number;
  unit: string;
  sizes: string[];
};

export type Photo = {
  id: string;
  url: string;
  description: string;
  markings: PhotoMarking[];
};

export type PhotoMarking = {
  id: string;
  x: number;
  y: number;
  description: string;
};