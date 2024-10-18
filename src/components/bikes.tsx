import * as DBWork from './DBWork';
import { useState, useEffect } from "react";
import {
  View,
} from "@aws-amplify/ui-react";
import { Link } from 'react-router-dom';
import {modelStats} from './interfaces'

// Define the types for bikeModels and other state
interface BikeModel {
  modelName?: string;
  [key: string]: any; // Allow for additional properties
}

export default function Bikes() {
  const [bikeModels, setBikeModels] = useState<modelStats[]>([]); // State with an array of BikeModel
  const [update, setUpdate] = useState<boolean>(false); // State to control the update flag

  // Sync the DataStore once when the component is rendered
  useEffect(() => {
    DBWork.syncDataStore();
  }, []);

  useEffect(() => {
    DBWork.fetchBikeModels(setBikeModels);
    console.log("here" + JSON.stringify(bikeModels));
    
    // Trigger an update if no bikeModels are fetched
    if (bikeModels.length === 0) {
      setUpdate(!update);
    } else {
      // No additional action needed if bikeModels exist
    }
  }, [update]);

  return (
    <View>
      {bikeModels.map((bikeModel, index) => (
        <View key={index}>
        <Link
        to="/Stats"
        state={{ bikeMod: bikeModel }} // Pass the state directly without `pathname`
        className="yes"
        >
        {bikeModel.modelName ? bikeModel.modelName : "Model Name Not Available"}
        </Link>
        </View>
      ))}
    </View>
  );
}
