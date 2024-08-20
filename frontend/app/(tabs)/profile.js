import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebase";
import { getDoc, collection, doc } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

export default function Profile() {
    StatusBar.setBarStyle('light-content');
    console.log(auth.currentUser);
    const userRef = doc(collection(db, "users"), auth.currentUser.uid);
    const [userData, setUserData] = useState();

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //          if (!user) {
    //             router.push('/signin');
    //         }
    //     })

    //     return unsubscribe;
    // }, []);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const data = await getDoc(userRef);
                const userData = data.data();
                setUserData(userData);
            } catch (error) {
                console.error(error);
            }
        };
        getUserProfile();
    }, [])

    const handleSignOut = () => {
        auth.signOut().then(() => {router.replace("/signin")}).catch(error => console.error(error));
    }

    return (
        <SafeAreaView className="bg-emerald-700 h-screen">
            <View className="relative justify-center items-center bg-emerald-700 z-30">
                <Stack.Screen options={{
                    headerTitle: "Profile", 
                    headerShown: true, 
                    headerTitleStyle: {fontSize: 32, fontWeight: "700", color: "white"},
                    headerTransparent: true,
                    headerBackTitle: "Back",
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity 
                        onPress={() => { router.push({ pathname: `/options/settings`})}}
                        className="ml-2 p-2">
                            <Text className="text-lg text-white font-semibold">Settings</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity 
                        onPress={handleSignOut}
                        className="mr-2 p-2">
                            <Text className="text-lg text-white font-semibold">Sign Out</Text>
                        </TouchableOpacity>
                    )
                }}/>
                <View className="rounded-full mt-8 top-12 p-[6px] shadow-lg bg-white">
                    {auth.currentUser.photoURL ? (
                        <Image source={{uri: auth?.currentUser?.photoURL}} className="aspect-square w-[50%] rounded-full"/>
                    ) : (
                        <Image source={{uri: "https://i.ndtvimg.com/mt/movies/2013-06/channing-waxxx.jpg"}} className="aspect-square w-[50%] rounded-full"/>
                    )}
                    
                </View>
            </View>
            <View className="bg-white flex flex-grow items-center">
                <View className="mt-16">
                    {userData && (
                    <View className="space-y-1">
                        <Text className="text-4xl font-semibold text-center">{auth?.currentUser?.displayName}</Text>
                        <Text style={styles.cardTextXl} className="font-semibold text-center">{userData?.permit} Permit</Text>
                    </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    cardTextXxl: {
        fontSize: 34,
    },
    cardTextSXl: {
        fontSize: 120,
    },
    cardTextXl: {
        fontSize: 20,
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