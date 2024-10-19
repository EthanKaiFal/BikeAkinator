
import {UserProfile, modelStats, Bike, brandData, modelData, bikeData, totalData} from './interfaces'
// Define types for user profile and bike objects
import client from './client'

export async function fetchUserProfile(user: any, setUserProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>, setLocalUserProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>){
    try{
        console.log("before before")
        console.log(client.models);
        const newUser : UserProfile = {
            id:user?.username,
        }
        setUserProfiles([newUser]);
        console.log("after");
        const { data: localProfiles, errors} = await client.models.User.list({
            filter: {      
                    userIdAMP: { eq: newUser.id},
            }
        });
        if(errors){
            console.error("error pulling current user profile")
        }
        if(localProfiles?.length===0){
            setLocalUserProfiles([await createNewUserProfile(user.username)]);
        }
        else{
            console.log("User profile found:", localProfiles);
            setLocalUserProfiles(localProfiles);
        }
    }
    catch(error){
        console.error("Error fetching user profile:", error);
    }
}

export async function createNewUserProfile( userIdAMPS:string) : Promise<UserProfile>{
    try{
        const newUserData = {
            userIdAMP: userIdAMPS,
            bikesOwned: []
        };
        const {data: users, errors} = await client.models.User.create(newUserData);
        if(errors){
            console.error("Errors occurred while creating user:", errors);
        }
        const newUser : UserProfile = {
            id:users?.userIdAMP ?? undefined
        }
       return newUser;
    }
    catch (error) {
        console.error("An error occurred while creating the user:", error);
        throw new Error("Failed to create user");
    }
}

export async function fetchBikeModels( setBikeModels: React.Dispatch<React.SetStateAction<modelStats[]>>) {
    const{data: models , errors} = await client.models.modelStats.list();
    if(errors){
        throw new Error("Failed to fetch models");
    }
    setBikeModels(models as modelStats[])
}

export async function fetchUserBikes( setUserBikes: React.Dispatch<React.SetStateAction<Bike[]>>, userprofiles: UserProfile[], update: boolean, setUpdatePage:React.Dispatch<React.SetStateAction<boolean>>){
    let user :UserProfile;

    if(userprofiles.length===0){
        //setUpdatePage(!update);
        return;
    }
    else{
        user=userprofiles[0];
            const { data: bikesData, errors}  = await client.models.Bike.list({
                filter: {      
                        userId: { eq: user.id},
                }
            });
            if(errors){
                console.error("problem with getting bikes");
                return;
            }
            const convertBikeData : Bike[] = bikesData as Bike[];
            const sortedBikes = convertBikeData.sort((a, b) => (a.bikeNumber??0) - (b.bikeNumber??0));
            setUserBikes(sortedBikes as Bike[]);

    }
}

export async function createNewBike(bikeData: Bike){
        const {data: newBike, errors}= await client.models.Bike.create(bikeData);
        if(errors){
            console.error("error creating new bike");
            return false;
        }
        else{
            return true;
        }
    
}

export async function updateAllBikeStats( bikeData: Bike){
    try{
        updateBrandStats(bikeData);
        updateModelStats(bikeData);
        updateBikeStats(bikeData);
        updateTotalStats(bikeData);
    }
    catch{
        console.error("error updating");
    }
}

async function updateBrandStats(bikeData: Bike) {
    // Query for existing brand stats
    const {data: brands, errors} = await client.models.BrandStats.list({
        filter: {
            brandName: {eq: bikeData.brand}
        }
    });

    if(errors){
        console.error("error fectching brand stats");
    }
    
    let brandData :brandData;
    
    // Create new brand entry if the brand does not exist
    if (brands.length === 0) {
      brandData = {
        brandName: bikeData.brand,
        avgSatisScore: bikeData.score,
        totalNumBikes: 1, // Start counting from 1 for the first entry
        numFirstBike: 0,
        numSecondBike: 0,
        numThirdPlusBike: 0,
        numBroken: bikeData.broken ? 1 : 0, // Initialize based on current bike
        numSold: bikeData.sold ? 1 : 0, // Initialize based on current bike
        avgOwnership: bikeData.ownershipMonths,
      };
      
      // Save the new brand data
        const {errors} = await client.models.BrandStats.create(brandData) // Use the model constructor
        console.log("New brand data created successfully");
        if(errors){
        console.error("Error saving new brand data:"+errors);
        }
    } 
    else {
      // If brand exists, update the existing entry
      brandData = brands[0] as brandData;
  
      // Increment totalNumBikes
      brandData.totalNumBikes = brandData.totalNumBikes + 1;
  
      // Update avgSatisScore and avgOwnership
      const totalBikes = brandData.totalNumBikes;
        brandData.avgSatisScore = ((brandData.avgSatisScore * (totalBikes - 1)) + bikeData.score) / totalBikes;
        brandData.avgOwnership = ((brandData.avgOwnership * (totalBikes - 1)) + bikeData.ownershipMonths) / totalBikes;
  
      // Increment broken and sold numbers
      if (bikeData.broken) {
        brandData.numBroken += 1;
      }
      if (bikeData.sold) {
        brandData.numSold += 1;
      }
  
      // Increment right bike number
      if (bikeData.bikeNumber === 1) {
        brandData.numFirstBike += 1;
      } else if (bikeData.bikeNumber === 2) {
        brandData.numSecondBike += 1;
      } else if (bikeData.bikeNumber >= 3) {
        brandData.numThirdPlusBike += 1;
      }
  
      // Now create a copy of the existing entry and save the updated data
      try {
        await client.models.BrandStats.update({
            id: brands[0].id,
            ...brandData,
        });
        console.log("Brand stats updated successfully");
      } catch (error) {
        console.error("Error updating brand data:", error);
      }
    }
  }


  async function updateModelStats( bikeData: Bike) {
    // Query for existing model stats
    const {data: models, errors} = await client.models.modelStats.list({
        filter: {
            modelName: {eq: bikeData.model}
        }
    });

    if(errors){
        console.error("error fectching model stats");
    }
    
    let modelData :modelData;
    
    // Create new model entry if the model does not exist
    if (models.length === 0) {
      modelData = {
        brandName: bikeData.brand,
        modelName: bikeData.model,
        avgSatisScore: bikeData.score,
        totalNumBikes: 1, // Start counting from 1 for the first entry
        numFirstBike: 0,
        numSecondBike: 0,
        numThirdPlusBike: 0,
        numBroken: bikeData.broken ? 1 : 0, // Initialize based on current bike
        numSold: bikeData.sold ? 1 : 0, // Initialize based on current bike
        avgOwnership: bikeData.ownershipMonths,
      };
      
      // Save the new model data
        const {errors} = await client.models.modelStats.create(modelData) // Use the model constructor
        console.log("New model data created successfully");
        if(errors){
        console.error("Error saving new model data:"+errors);
        }
    } 
    else {
      // If model exists, update the existing entry
      modelData = models[0] as modelData;
  
      // Increment totalNumBikes
      modelData.totalNumBikes = modelData.totalNumBikes + 1;
  
      // Update avgSatisScore and avgOwnership
      const totalBikes = modelData.totalNumBikes;
        modelData.avgSatisScore = ((modelData.avgSatisScore * (totalBikes - 1)) + bikeData.score) / totalBikes;
        modelData.avgOwnership = ((modelData.avgOwnership * (totalBikes - 1)) + bikeData.ownershipMonths) / totalBikes;
  
      // Increment broken and sold numbers
      if (bikeData.broken) {
        modelData.numBroken += 1;
      }
      if (bikeData.sold) {
        modelData.numSold += 1;
      }
  
      // Increment right bike number
      if (bikeData.bikeNumber === 1) {
        modelData.numFirstBike += 1;
      } else if (bikeData.bikeNumber === 2) {
        modelData.numSecondBike += 1;
      } else if (bikeData.bikeNumber >= 3) {
        modelData.numThirdPlusBike += 1;
      }
  
      // Now create a copy of the existing entry and save the updated data
      try {
        await client.models.modelStats.update({
            id: models[0].id,
            ...modelData,
        });
        console.log("model stats updated successfully");
      } catch (error) {
        console.error("Error updating model data:", error);
      }
    }
  }

  async function updateBikeStats(bikeData: Bike) {
    const {data: bikeStats, errors} = await client.models.bikeStats.list({
        filter: {
            modelName: {eq: bikeData.model},
            bikeYear: {eq: bikeData.year}
        }
    });
    if(errors){
        console.error("error fetching bikeStats");
        return;
    }

    var pulledBikeStatData : bikeData;
    if(bikeStats.length===0){
        pulledBikeStatData = {
            modelName: bikeData.model,
            bikeNum: 1,
            bikeYear: bikeData.year
        };

        const {errors} = await client.models.bikeStats.create(pulledBikeStatData);
        if(errors){
            console.error("error creating new bike stat");
        }
    }
    else{
        pulledBikeStatData = bikeStats[0] as bikeData;
        pulledBikeStatData.bikeNum += 1;

        const {errors} = await client.models.bikeStats.update({
            id: bikeStats[0].id,
            ...pulledBikeStatData
        }
        );
        if(errors){
            console.error("error updating the bikeStats");
        }
    }
  }

  async function updateTotalStats(bikeData:Bike){
    const {data: entries, errors} = await client.models.totalStats.list();
    if(errors){
        console.error("couldnt get total stats");
        return;
    }
    var pulledStatData: totalData;

    if(entries.length===0){
        pulledStatData = {
            totalNumBikes: 0,
            totalNumBroken: 0,
            totalNumSold: 0,
            totalNumFirst: 0,
            totalNumSecond: 0,
            totalNumThird: 0,
            totalAvgOwnership: 0,
            totalAvgSatisScore: 0,
          };
    }
    else{
        pulledStatData = entries[0] as totalData;

    }

    // Increment totalNumBikes
    pulledStatData.totalNumBikes = pulledStatData.totalNumBikes??0 +1;
    if(bikeData.broken){
    pulledStatData.totalNumBroken = pulledStatData.totalNumBroken??0 +1;
    }
    if(bikeData.sold){
    pulledStatData.totalNumSold = pulledStatData.totalNumSold??0 +1;
    }

    if(bikeData.bikeNumber === 1){
    pulledStatData.totalNumFirst = pulledStatData.totalNumFirst??0 +1;
    }
    if(bikeData.bikeNumber === 2){
    pulledStatData.totalNumSecond = pulledStatData.totalNumSecond??0 +1;
    }
    if(bikeData.bikeNumber >= 3){
    pulledStatData.totalNumThird = pulledStatData.totalNumThird??0 +1;
    }

    const totalBikes = pulledStatData.totalNumBikes;
        pulledStatData.totalAvgSatisScore = ((pulledStatData.totalAvgSatisScore??0 * (totalBikes - 1)) + bikeData.score) / totalBikes;
        pulledStatData.totalAvgOwnership = ((pulledStatData.totalAvgOwnership??0 * (totalBikes - 1)) + bikeData.ownershipMonths) / totalBikes;
    if(entries.length!=0){
        const {errors} = await client.models.totalStats.update({
        id: entries[0].id,
        ...pulledStatData,
    })
    if(errors){
        console.error("error updating totalStat")
    }
}
else{
    const {errors} = await client.models.totalStats.create(
        pulledStatData)
        if(errors){
            console.error("error creating new totalStat")
        }
}
}