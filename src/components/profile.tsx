import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import "./Login.css";
import { DataStore } from "@aws-amplify/datastore";
import * as DBWork from "./DBWork";
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);



// Define types for user profile and bike objects
interface UserProfile {
  id?: string;
  email?: string;
}

interface Bike {
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

export default function Login() {
  // State declarations with types
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [localUserProfiles, setLocalUserProfiles] = useState<UserProfile[]>([]);
  const [userBikes, setUserBikes] = useState<Bike[]>([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  // Profile info inputs
  const [yearsRiding, setYearsRiding] = useState<number>(0);
  const [bikeNumber, setBikeNumber] = useState<number>(-1);
  const [bikeBrand, setBikeBrand] = useState<string>("");
  const [bikeModel, setBikeModel] = useState<string>("");
  const [bikeYear, setBikeYear] = useState<number>(0);
  const [bikeSold, setBikeSold] = useState<boolean>(false);
  const [bikeScore, setBikeScore] = useState<number>(0.0);
  const [bikeBroken, setBikeBroken] = useState<boolean>(false);
  const [monthsOwned, setMonthsOwned] = useState<number>(0);

  // Frontend status variables
  const [addingNewBike, setAddingPage] = useState<boolean>(false);
  const [update, setUpdatePage] = useState<boolean>(false);

  // Input change handlers with typed events
  const handleYearsRiding = (event: ChangeEvent<HTMLInputElement>) => {
    setYearsRiding(parseInt(event.target.value, 10));
  };
  
  const handleBikeNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeNumber(parseInt(event.target.value, 10));
  };

  const handleBikeBrand = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeBrand(event.target.value);
  };

  const handleBikeModel = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeModel(event.target.value);
  };

  const handleBikeYear = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeYear(parseInt(event.target.value, 10));
  };

  const handleBikeSold = (event: ChangeEvent<HTMLSelectElement>) => {
    setBikeSold(event.target.value === "Yes");
  };

  const handleBikeScore = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeScore(parseFloat(event.target.value));
  };

  const handleBikeBroken = (event: ChangeEvent<HTMLSelectElement>) => {
    setBikeBroken(event.target.value === "Yes");
  };

  const handleMonthsOwned = (event: ChangeEvent<HTMLInputElement>) => {
    setMonthsOwned(parseInt(event.target.value, 10));
  };

  // Handler to set the page to "add a new bike" mode
  const handleAddBike = () => {
    setAddingPage(true);
  };

  // Handler to remove a bike
  const handleRemove = async (bike: Bike) => {
    await DataStore.delete(bike);
    setUpdatePage(!update);
  };

  // Save button handler after a bike is added
  const handleSaveBike = async (event: FormEvent) => {
    event.preventDefault();
    const myProfile: UserProfile = localUserProfiles[0];
    console.log("localProf" + JSON.stringify(myProfile));

    const bikeData: Bike = {
      bikeNumber,
      brand: bikeBrand,
      model: bikeModel,
      year: bikeYear,
      sold: bikeSold,
      broken: bikeBroken,
      ownershipMonths: monthsOwned,
      score: bikeScore,
      userId: myProfile.id || '',
    };

    // Push to backend
    const success = await DBWork.createNewBike(bikeData);
    if (success) {
      restoreBikeSettingDefaults();
      DBWork.updateAllBikeStats(bikeData);
    }
  };

  // Reset form after saving
  const restoreBikeSettingDefaults = () => {
    setBikeBrand("");
    setBikeBroken(false);
    setBikeModel("");
    setBikeNumber(-1);
    setBikeScore(0.0);
    setBikeSold(false);
    setBikeYear(0);
    setMonthsOwned(0);
    setAddingPage(false);
    setUpdatePage(!update);
  };

  // Sync DataStore
  DBWork.syncDataStore();

  // Queries to the database
  useEffect(() => {
    const interval = setInterval(() => {
      DBWork.fetchUserProfile(setUserProfiles, setLocalUserProfiles);
      console.log("local" + localUserProfiles);
      DBWork.fetchUserBikes(setUserBikes, localUserProfiles, update, setUpdatePage);

      if (userBikes.length > 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userBikes]);

  // Helper to display user bikes
  const displayUserBikes = () => {
    return (
      <View>
        {userBikes.map((userBike) => (
          <View key={userBike.id}>
            <p className="bikeDisplayLine">Bike Number: {userBike.bikeNumber}</p>
            <p className="bikeDisplayLine">Brand: {userBike.brand}</p>
            <p className="bikeDisplayLine">Model: {userBike.model}</p>
            <p className="bikeDisplayLine">Year: {userBike.year}</p>
            <p className="bikeDisplayLine">Broken: {userBike.broken ? "Yes" : "No"}</p>
            <p className="bikeDisplayLine">Sold: {userBike.sold ? "Yes" : "No"}</p>
            <p className="bikeDisplayLine">Months Owned: {userBike.ownershipMonths}</p>
            <p className="bikeDisplayLine">Bike Score: {userBike.score}</p>
            <Button onClick={() => handleRemove(userBike)}>Remove</Button>
          </View>
        ))}
      </View>
    );
  };

  // Helper to display input form for adding a new bike
  const displayNewBikeInputForm = () => {
    return (
      <View>
        {/* Form fields */}
        <View className="inputField">
          <p>What number bike is this?</p>
          <input
            type="number"
            value={bikeNumber}
            onChange={handleBikeNumber}
            placeholder="Type in your bike number"
          />
        </View>
        <View className="inputField">
        <p>Brand:</p>
        <input 
        type="text" 
        value={bikeBrand} 
        onChange={handleBikeBrand} 
        placeholder="Type in your bike brand" 
      />
      </View>
      <View className="inputField">
        <p>Model:</p>
        <input 
        type="text" 
        value={bikeModel} 
        onChange={handleBikeModel} 
        placeholder="Type in your bike model" 
      />
      </View>  
      <View className="inputField">
        <p>Year:</p>
        <input 
        type="text" 
        value={bikeYear} 
        onChange={handleBikeYear} 
        placeholder="Type in your bike year" 
      />
      </View>   
      <View className="inputField">
        <p>Is this bike already sold?</p>
        <select value={bikeSold ? "Yes": "No"} onChange={handleBikeSold}>
          <option value="">Select...</option>{/*Placeholder*/}
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </View>
      <View className="inputField">
        <p>Has this bike been significantly broken before?</p>
        <select value={bikeBroken ? "Yes": "No"} onChange={handleBikeBroken}>
          <option value="">Select...</option>{/*Placeholder*/}
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </View>  
      <View className="inputField">
        <p>How many months have you owned this bike?</p>
        <input 
        type="number" 
        value={monthsOwned} 
        onChange={handleMonthsOwned} 
        step="1"
        placeholder=""
      />  
      </View>
      <View className="inputField">
        <p>From 1-10 how would rate your experience with this bike? Decimals like 8.8 are usable.</p>
        <input 
        type="number" 
        value={bikeScore} 
        onChange={handleBikeScore} 
        min="0.0"
        max="10.0"
        step="0.1"
        placeholder=""
      />  
      </View>
        <Button onClick={handleSaveBike}>Save Bike</Button>
      </View>
    );
  };

  return (
    <Flex className="App" justifyContent="center" alignItems="center" direction="column" width="70%" margin="0 auto">
      <Heading level={1}>My Profile</Heading>
      <Divider />
      <Grid margin="3rem 0" autoFlow="column" justifyContent="center" gap="2rem" alignContent="center">
        {userProfiles.map((userProfile) => (
          <Flex key={userProfile.id} direction="column" justifyContent="center" alignItems="center" gap="2rem" border="1px solid #ccc" padding="2rem" borderRadius="5%" className="box">
            <View>
              <Heading level={3}>{userProfile.email}</Heading>
              <View>{displayUserBikes()}</View>
              <View>{addingNewBike ? displayNewBikeInputForm() : <Button onClick={handleAddBike}>Add Bike</Button>}</View>
            </View>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
