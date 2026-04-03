// Local Hot Wheels type definitions
// These mirror the backend interface as described in the project spec.
// The auto-generated backend.d.ts is empty in this project; types are defined here.

export interface HotWheelsCar {
  id: bigint;
  tampo: string;
  model: string;
  name: string;
  createdAt: bigint;
  color: string;
  year: bigint;
  description: string;
  series: string;
  scale: string;
  countryOfOrigin: string;
  photoId?: string;
  imageUrl?: string;
}

export interface CarInput {
  tampo: string;
  model: string;
  name: string;
  color: string;
  year: bigint;
  description: string;
  series: string;
  scale: string;
  countryOfOrigin: string;
  photoId?: string;
}

export interface HWBackend {
  addCar(input: CarInput): Promise<bigint>;
  deleteCar(id: bigint): Promise<void>;
  filterCars(
    year: bigint | null,
    model: string | null,
    series: string | null,
    color: string | null,
  ): Promise<HotWheelsCar[]>;
  getCallerUserRole(): Promise<string>;
  getCar(id: bigint): Promise<HotWheelsCar>;
  getCarsByModel(modelName: string): Promise<HotWheelsCar[]>;
  getCarsBySeries(seriesName: string): Promise<HotWheelsCar[]>;
  getCarsByYear(year: bigint): Promise<HotWheelsCar[]>;
  getDistinctModels(): Promise<string[]>;
  getDistinctSeries(): Promise<string[]>;
  getDistinctYears(): Promise<bigint[]>;
  isCallerAdmin(): Promise<boolean>;
  listCars(): Promise<HotWheelsCar[]>;
  searchCars(searchQuery: string): Promise<HotWheelsCar[]>;
  updateCar(id: bigint, input: CarInput): Promise<void>;
}
