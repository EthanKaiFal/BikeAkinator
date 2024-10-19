export interface UserProfile {
    id?: string;
  }

export interface modelStats {
    modelName: string,
    brandName: string,
    avgSatisScore: number,
    totalNumBikes: number,
    numFirstBike: number,
    numSecondBike: number,
    numThirdPlusBike: number,
    numBroken: number,
    numSold: number,
    avgOwnership: number,
}

export interface Bike {
  id?: string;
  bikeNumber: number;
  brand: string;
  model: string;
  year: number;
  sold: boolean;
  broken: boolean;
  ownershipMonths: number;
  score: number;
  userId: string;
}

export interface brandData{
        brandName: string,
        avgSatisScore: number,
        totalNumBikes: number, // Start counting from 1 for the first entry
        numFirstBike: number,
        numSecondBike: number,
        numThirdPlusBike: number,
        numBroken: number, // Initialize based on current bike
        numSold: number, // Initialize based on current bike
        avgOwnership: number,
}

export interface modelData{
  modelName: string,
  brandName: string,
  avgSatisScore: number,
  totalNumBikes: number, // Start counting from 1 for the first entry
  numFirstBike: number,
  numSecondBike: number,
  numThirdPlusBike: number,
  numBroken: number, // Initialize based on current bike
  numSold: number, // Initialize based on current bike
  avgOwnership: number,
}

export interface bikeData{
  modelName: string,
  bikeYear: number,
  bikeNum: number,
}

export interface totalData{
  totalAvgSatisScore: number,
      totalNumBikes: number,
      totalNumFirst: number,
      totalNumSecond: number,
      totalNumThird: number,
      totalNumBroken: number,
      totalNumSold: number,
      totalAvgOwnership: number,
}