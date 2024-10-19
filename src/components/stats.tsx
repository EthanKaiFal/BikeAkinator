
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native-web';
import { PieChart, Pie, Cell } from 'recharts';

// Define functions outside the Stats component
const getLocalData = (bikename) => {
    // Call to backend
    return { [bikename]: { "percent": 0.6, "numAssigned": 450, "percentOwned": 0.5, "numOwned": 400 } };
};

const displayLocalData = (bikename) => {
    const bikeData = getBikeData(bikename);
    const brandData = getBrandData(bikeData.brand);
    const modelData = getModelData(bikeData.model);
    const bikeStats = getBikeData(bikeData.model, bikeData.year);
    const totalStats = getTotalStats();

    const brandNum = brandData.totalNumBikes;
    const modelNum = modelData.totalNumBikes;
    const totalNumBikes = totalStats.totalNumBikes;

    const firstBikeMakeComp = modelData.numFirstBike;
    const firstBikeTotalNum = totalStats.totalNumFirst;

    const secondBikeMakeComp = modelData.numSecondBike;
    const secondBikeTotalNum = totalStats.totalNumSecond;

    const thirdBikeMakeComp = modelData.numThirdBike;
    const thirdBikeTotalNum = totalStats.totalNumThird;

    const numBrokenByModel= modelData.numBroken;
    const numBrokenByBrand = brandData.numBroken;
    const totalNumBroken = totalStats.totalNumBroken;

    const numSoldByModel = modelData.numSold;
    const numSoldByBrand = brandData.numSold;
    const totalNumSold = totalStats.totalNumSold;

    const avgSatisScoreByModel = modelData.avgSatisScore;
    const totalAvgSatisScore = totalStats.totalAvgSatisScore;

    const avgSatisScoreByBrand = brandData.totalAvgSatisScore;
    const totalAvgOwnerShip = totalStats.totalAvgOwnerShip

    //data groups for charts
    const brandAgainstAllPie = [
      {name: brandData.brandName, value: brandNum},
      {name : 'other', value: (totalNumBikes-brandNum)},
    ]

    const modelAgainstAllPie = [
      {name: modelData.modelName, value: modelNum},
      {name: 'other', value: (totalNumBikes-modelNum)}
    ]

    const modelAgainstFirstBike = [
      {name: modelData.modelName, value: firstBikeMakeComp},
      {name: 'other', value: (firstBikeTotalNum-firstBikeMakeComp)},
    ]

    const modelAgainstSecondBike = [
      {name: modelData.modelName, value: secondBikeMakeComp},
      {name: 'other', value: (secondBikeTotalNum-secondBikeMakeComp)},
    ]

    const modelAgainstThirdBike = [
      {name: modelData.modelName, value: thirdBikeMakeComp},
      {name: 'other', value: (thirdBikeTotalNum-thirdBikeMakeComp)},
    ]

    const percentBrokenModelData = numBrokenByModel/modelNum;

    const percentSoldModelData = numSoldByModel/modelNum;


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
};

export default function Stats() {

//   useEffect(() => {
//     //syncDataStore();
//     data = DBWork.fetchStats();

//     displayLocalData(data);
    
//   }, []);


    return (
        <ScrollView style={{ flex: 1 }}>
        </ScrollView>
    );
}
