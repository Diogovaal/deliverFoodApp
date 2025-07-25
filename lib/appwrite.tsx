import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    Platform:"com.dc.foodordering",
    databaseId: '6869548000228e18e646',
    bucketId: '686a9c75000ecf7ac2fb',
    userCollectionId: '686954bd0037fe0a6987',
    categoriesCollectionId: '686a9287003d4b2aaa2d',
    menuCollectionId: '686a9392000641bf4254',
    customizationsCollectionId: '686a97e10036c07f1d3d',
    menuCustomizationsCollectionId: '686a98ee00024695edb0',
   

}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.Platform);

export const account = new Account(client);
export const database = new Databases(client)
export const storage = new Storage(client);
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

export const getMenu = async ({category, query}:GetMenuParams) => {
try{
    const queries : string[]=[];
    if(category) {
        queries.push(Query.equal('category', category));
    }if(query) {
        queries.push(Query.search('name', query));
    }
    const menu = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries,
    ); return menu.documents;

} catch (e) {
    throw new Error(e as string);
}

}

export const getCategories = async () => {
    try {
        const categories = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        );
        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}