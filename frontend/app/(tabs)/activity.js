import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Stack, router } from "expo-router";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { getDoc, collection, where, query, onSnapshot, doc } from "firebase/firestore";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Activity() {
    const [recentParking, setRecentParking] = useState([]);
    const [favoriteParking, setFavoriteParking] = useState([]);
    const parkingSpacesRef = collection(db, "parkingspaces");
    const [search, setSearch] = useState("");
    const currentUserRef = doc(collection(db, "users"), auth.currentUser.uid);
    const [recentsQuery, setRecentsQuery] = useState(null);
    const [favoritesQuery, setFavoritesQuery] = useState(null);

    // useEffect(() => {
    //     const getUserRecents = async () => {
    //       try {
    //         const data = await getDoc(currentUserRef);
    //         const userData = data.data();
    //         console.log(userData);

    //         const searchQuery = query(parkingSpacesRef, where('uid', 'in', userData.recents));
    //         setRecentsQuery(searchQuery);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
        
    //     getUserRecents();
    //   }, [])

      useEffect(() => {
            const unsubscribe = onSnapshot(currentUserRef, (docSnapshot) => {
                const updatedData = docSnapshot.data()
                // console.log("UPDATED   ", updatedData);
                if (updatedData && updatedData.recents && Array.isArray(updatedData.recents) && updatedData.recents.length > 0) {
                    const recentsSearchQuery = query(parkingSpacesRef, where('__name__', 'in', updatedData.recents));
                    setRecentsQuery(recentsSearchQuery);
                } else {
                    setRecentParking([]);
                }
                if (updatedData && updatedData.favorites && Array.isArray(updatedData.favorites) && updatedData.favorites.length > 0) {
                    const favoritesSearchQuery = query(parkingSpacesRef, where('__name__', 'in', updatedData.favorites));
                    setFavoritesQuery(favoritesSearchQuery);
                } else {
                    setFavoriteParking([]);
                }
                // setRecentsQuery(recentsSearchQuery);
                // setFavoritesQuery(favoritesSearchQuery);
            });
        
            return () => unsubscribe();
    }, []);

      useEffect(() => {
        if (recentsQuery) {
            const unsubscribe = onSnapshot(recentsQuery, (querySnapshot) => {
                const updatedData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // console.log(updatedData);
                setRecentParking(updatedData);
            });
        
            return () => unsubscribe();
        }
        
    }, [recentsQuery]);

    useEffect(() => {
        if (favoritesQuery) {
            const unsubscribe = onSnapshot(favoritesQuery, (querySnapshot) => {
                const updatedData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // console.log(updatedData);
                setFavoriteParking(updatedData);
            });
        
            return () => unsubscribe();
        }
    }, [favoritesQuery]);

    console.log(recentParking);
    console.log(favoriteParking);

    return (
        <SafeAreaView className="bg-white h-screen">
            <Stack.Screen options={{
                headerTitle: "Your Activity", 
                headerShown: true, 
                headerTitleStyle: {fontSize: 28},
                headerBackTitle: "Back",
                headerShadowVisible: false
            }}/>

            {/* <View className="flex bg-neutral-100 rounded-full border border-neutral-200 mx-4 mt-4">
                <TextInput 
                style={styles.searchBarText} 
                className="py-3 px-4" 
                placeholder="Search" 
                placeholderTextColor="#a3a3a3"
                value={search}
                onChangeText={(text) => setSearch(text)}
                />
            </View> */}

            <ScrollView className="mt-4 mx-4 space-y-4">

            <View className="flex bg-neutral-100 rounded-full border border-neutral-200">
                <TextInput 
                style={styles.searchBarText} 
                className="py-3 px-4" 
                placeholder="Search" 
                placeholderTextColor="#a3a3a3"
                value={search}
                onChangeText={(text) => setSearch(text)}
                />
            </View>

                <View className="flex flex-col space-y-4">

                    <Text style={styles.cardTextXl} className="font-semibold">Recents</Text>
                    
                    <ScrollView 
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    className="flex flex-row min-w-full space-x-4">
                        {recentParking.length > 0 && recentParking.map((space) => (
                            <TouchableOpacity 
                            onPress={() => { router.push({ pathname: `/parkingspace/${space.id}`, params: { id: space.id }})}}
                            key={space.id} 
                            className="flex flex-col justify-start h-48 w-32">
                                <Image source={{uri: space.image}} className="aspect-square h-32 rounded-lg"/>
                                <View className="mt-1 flex-grow flex-col justify-between">
                                    <Text style={styles.cardTextMd} className="font-semibold" numberOfLines={2}>{space.name}</Text>
                                    <Text style={styles.cardTextMd} className="font-medium text-neutral-500">{space.openspots} available spots</Text>
                                </View>
                            </TouchableOpacity>
                            ))}
                        {recentParking == 0 && (
                            <TouchableOpacity 
                            onPress={() => {router.push({ pathname: '/home'})}}
                            className="flex flex-col justify-start h-48 w-32">
                                <View className="flex justify-center items-center aspect-square h-32 rounded-lg bg-neutral-200">
                                    <MaterialCommunityIcons name="plus-box-multiple" size={50} color={"#a3a3a3"}/>
                                </View>
                                <View className="mt-1 flex-grow flex-col justify-between">
                                    <Text style={styles.cardTextMd} className="font-semibold" numberOfLines={2}>Add To Recents</Text>
                                    {/* <Text style={styles.cardTextMd} className="font-medium text-neutral-500">test</Text> */}
                                </View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                </View>

                <View className="flex flex-col space-y-4">

                    <Text style={styles.cardTextXl} className="font-semibold">Favorites</Text>

                    <ScrollView 
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    className="flex flex-row min-w-full space-x-4">
                        {favoriteParking.length > 0 && favoriteParking.map((space) => (
                            <TouchableOpacity 
                            onPress={() => { router.push({ pathname: `/parkingspace/${space.id}`, params: { id: space.id }})}}
                            key={space.id} 
                            className="flex flex-col justify-start h-48 w-32">
                                <Image source={{uri: space.image}} className="aspect-square h-32 rounded-lg"/>
                                <View className="mt-1 flex-grow flex-col justify-between">
                                    <Text style={styles.cardTextMd} className="font-semibold" numberOfLines={2}>{space.name}</Text>
                                    <Text style={styles.cardTextMd} className="font-medium text-neutral-500">{space.openspots} available spots</Text>
                                </View>
                            </TouchableOpacity>
                            ))}
                        {favoriteParking == 0 && (
                            <TouchableOpacity 
                            onPress={() => {router.push({ pathname: '/home'})}}
                            className="flex flex-col justify-start h-48 w-32">
                                <View className="flex justify-center items-center aspect-square h-32 rounded-lg bg-neutral-200">
                                    <MaterialCommunityIcons name="plus-box-multiple" size={50} color={"#a3a3a3"}/>
                                </View>
                                <View className="mt-1 flex-grow flex-col justify-between">
                                    <Text style={styles.cardTextMd} className="font-semibold" numberOfLines={2}>Add To Favorites</Text>
                                    {/* <Text style={styles.cardTextMd} className="font-medium text-neutral-500">test</Text> */}
                                </View>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    cardTextXl: {
        fontSize: 26,
      },
    cardTextLg: {
      fontSize: 18,
    },
    cardTextBase: {
        fontSize: 16,
    },
    cardTextMd: {
        fontSize: 15,
    },
    searchBarText: {
        fontSize: 15,
        fontWeight: "500",
    },
    scrollViewContainer: {
        display: "flex",
        flexDirection: "column",
    }
  });