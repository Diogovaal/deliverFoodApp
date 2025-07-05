import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    Platform:"com.dc.foodordering",
    databaseId: '6869548000228e18e646',
    userCollectionId: '686954bd0037fe0a6987',
   

}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.Platform);

export const account = new Account(client);
export const database = new Databases(client)
const avatars = new Avatars(client);

export const createUser = async ({name, email, password}:CreateUserParams) => {
    try{
        const newAccount = await account.create(
            ID.unique(), email, password, name)
        if(!newAccount) {
            throw new Error('Erro ao criar conta')
        } 
        
        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name)

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email, name, avatar: avatarUrl
            }
        ) ;

        return newUser;


    } catch (e) {
        throw new Error(e as string );
    }

}

export const signIn = async ({email, password}:SignInParams)=> {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }

}

export const getCurrentUser = async () => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) {
            throw new Error('Usuário não encontrado');
        }
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', currentAccount.$id)
            ]
         )
         if(!currentUser) throw Error;

         return currentUser.documents[0];

    }catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}