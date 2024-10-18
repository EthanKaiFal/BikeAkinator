import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import {UserProfile, modelStats} from './interfaces'
// Define types for user profile and bike objects
const client = generateClient<Schema>();

export async function fetchUserProfile(setUserProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>, setLocalUserProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>){
    try{
        const { user } = useAuthenticator();
        const newUser : UserProfile = {
            id:user?.username,
        }
        setUserProfiles([newUser]);
        const { data: localProfiles, errors} = await client.models.User.list({
            filter: {      
                    userIdAMP: { eq: newUser.id},
            }
        });
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

export async function createNewUserProfile(userIdAMPS:string) : Promise<UserProfile>{
    try{
        const newUserData = {
            userIdAMP: userIdAMPS,
            bikesOwned: []
        };
        const {data: users, errors} = await client.models.User.create(newUserData);
        if(errors){
            console.error("Errors occurred while creating user:", errors);
            throw new Error("Failed to create user");
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

export async function fetchBikeModels(setBikeModels: React.Dispatch<React.SetStateAction<modelStats[]>>) {
    const{data: models , errors} = await client.models.modelStats.list();
    if(errors){
        throw new Error("Failed to fetch models");
    }
    setBikeModels(models as modelStats[])
}