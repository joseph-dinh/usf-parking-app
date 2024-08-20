import { useState, useEffect } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView, View, Text, Image, StyleSheet, Linking, Platform } from "react-native";
import { collection, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Page() {
  const params = useLocalSearchParams();
  const currentUserRef = doc(collection(db, "users"), auth.currentUser.uid);
  const [parkingSpace, setParkingSpace] = useState({});
  const parkingSpacesRef = collection(db, "parkingspaces");
  const parkingSpaceDocRef = doc(parkingSpacesRef, params.id);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const addToRecents = async () => {
      try {
        const data = await getDoc(currentUserRef);
        const userData = data.data();

        let userFavorites = userData.favorites;
        if (Array.isArray(userFavorites) && userFavorites.includes(params.id)) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }

        const userRecents = userData.recents;
        if (userRecents[0] == "") {
          userRecents[0] = params.id;
        } else if (!userRecents.includes(params.id)) {
          userRecents.unshift(params.id);
        }

        await updateDoc(currentUserRef, {
          recents: userRecents
        });

      } catch (error) {
        console.error(error);
      }
    };
    
    addToRecents();
  }, [])

  const addToFavorites = async () => {
    try {
      console.log("Trying now")
      const data = await getDoc(currentUserRef);
      const userData = data.data();

      let userFavorites = userData.favorites;
      if (userFavorites[0] == "") {
        userFavorites[0] = params.id;
      } else if (!userFavorites.includes(params.id)) {
        userFavorites.unshift(params.id);
      } else if (userFavorites.includes(params.id)) {
        userFavorites = userFavorites.filter(favorite => favorite !== params.id);
        // console.log("already has", params.id);
        // console.log(userFavorites);
      }

      // console.log(userFavorites);

      await updateDoc(currentUserRef, {
        favorites: userFavorites
      });

      if (userFavorites.includes(params.id)) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }

    } catch (error) {
      console.error(error);
    }
  };
    
  useEffect(() => {
    const unsubscribe = onSnapshot(parkingSpaceDocRef, (docSnapshot) => {
        const updatedData = docSnapshot.data();
        // console.log(updatedData);
        setParkingSpace(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const lastUpdated = ( lastupdated ) => {
    const lastUpdatedFormatted = lastupdated.toDate();
    const currentTime = new Date();
    const timeDifference = currentTime - lastUpdatedFormatted;
    // console.log(timeFormatted.toLocaleString(), currentTime.toLocaleString());

    const timeAgo = Math.floor(timeDifference / (1000 * 60));

    if (timeAgo < 60) {
        return (timeAgo + "m ago")
    } else if (timeAgo >= 60 && ((timeAgo/60) < 24)) {
        return (Math.floor(timeAgo/60) + "h ago")
    } else {
        return ((Math.floor((timeAgo/60)/60) + "d ago"))
    }
  }

  console.log("hi", parkingSpace);

  const openMapsApp = () => {
    // Specify the latitude and longitude of the location you want to show
    
    const latitude = parkingSpace?.latitude;
    const longitude = parkingSpace?.longitude;

    console.log(latitude, longitude);
  
    // Use Apple Maps URL scheme for iOS
    const iosMapsUrl = `http://maps.apple.com/?q=${parkingSpace.name}&ll=${latitude},${longitude}`;
  
    // Use Google Maps URL scheme for iOS as a fallback
    const googleMapsUrl = `https://maps.google.com?q=${latitude},${longitude}`;
  
    // Combine both URLs and open the Maps app
    const url = Platform.OS === 'ios' ? iosMapsUrl : googleMapsUrl;
  
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        console.error('Maps app is not installed.');
      }
    }).catch((err) => console.error('An error occurred', err));
  };  

  return (
    <SafeAreaView className="bg-white h-screen">
      <Stack.Screen options={{
          headerTitle: "Parking Details", 
          headerShown: true, 
          headerTitleStyle: {fontSize: 28, color: "black"},
          
          headerBackTitle: "Back",
          headerBackTitleStyle: { fontSize: 18 },
          headerTintColor: "#065f46",
      }}/>

      <View className="px-4 pt-4">
        <View className="relative">
          {/* <TouchableOpacity className="absolute top-2 right-2 z-50">
            <MaterialCommunityIcons name="star" size={60} color={"black"}/>
          </TouchableOpacity> */}
          <Image 
          source={{uri: parkingSpace.image}}
          className="-z-20 aspect-[16/12] flex rounded-xl"
          loading="lazy"
          />
        </View>
        <View className="mt-3">
          <Text style={styles.cardTextXl} className="font-semibold">{parkingSpace?.name}</Text>
          <Text style={styles.cardTextBase} className="text-neutral-500 mt-1">{parkingSpace?.address}</Text>
          <Text style={styles.cardTextBase} className="font-semibold mt-1">{parkingSpace?.openspots} available spots</Text>
          <View className="h-[1px] w-full bg-neutral-200 my-4"/>
          <Text style={styles.cardTextBase} className=" text-neutral-500">Restricted Hours</Text>
          <Text style={styles.cardTextLg} className="font-semibold">07:00 AM - 5:30 PM</Text>
          <Text style={styles.cardTextLg} className="font-semibold">Mon - Fri</Text>
          <Text style={styles.cardTextBase} className="text-neutral-500 mt-1">Permits</Text>
          <Text style={styles.cardTextLg} className="font-semibold">{parkingSpace?.permits?.join(', ')}</Text>
          <Text style={styles.cardTextBase} className="text-neutral-500 mt-1">Last Updated</Text>
          <Text style={styles.cardTextLg} className="font-semibold">{parkingSpace.lastupdated ? lastUpdated(parkingSpace.lastupdated) : "..."}</Text>
          <View className="h-[1px] w-full bg-neutral-200 my-4"/>


          {/* <TouchableOpacity className="mt-4 bg-blue-500 p-5"
          onPress={() => addToFavorites()}
          ><Text>Add to Favorite</Text></TouchableOpacity> */}

          <View className="flex flex-col space-y-3">
            <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
            onPress={() => openMapsApp()}
            >
              <MaterialCommunityIcons name="directions" color={"#0284c7"} size={30}/>
              <Text className="text-lg font-medium">Get Directions</Text>
              <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
            </TouchableOpacity>

            <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
            onPress={() => addToFavorites()}
            >
              {isFavorite && (
                <>
                  <MaterialCommunityIcons name="star" color={"#facc15"} size={30}/>
                  <Text className="text-lg font-medium">Remove From Favorites</Text>
                </>
              )}
              {!isFavorite && (
                <>
                  <MaterialCommunityIcons name="star-outline" color={"black"} size={30}/>
                  <Text className="text-lg font-medium">Add To Favorites</Text>
                </>
              )}
              <MaterialCommunityIcons name="chevron-right" color={"white"} size={30} />
            </TouchableOpacity>
          </View>
        

          {/* <View className="flex flex-row justify-center items-center min-w-full space-x-2">
            <View className="bg-blue-200 aspect-square w-[60%]"/>
            <View className="bg-blue-200 aspect-square w-[%]"/>
          </View> */}
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cardTextXl: {
    fontSize: 24,
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