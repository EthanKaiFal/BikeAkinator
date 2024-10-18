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