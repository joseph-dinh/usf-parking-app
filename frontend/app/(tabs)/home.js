import { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Stack, router } from "expo-router";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { getDocs, collection, where, query, onSnapshot } from "firebase/firestore";
import { StatusBar } from "react-native";
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = () => {
    StatusBar.setBarStyle('dark-content');

    //   useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //          if (!user) {
    //             router.push('/signin');
    //         }
    //     })

    //     return unsubscribe;
    // }, []);

    const [parkingSpaces, setParkingSpaces] = useState([]);
    const parkingSpacesRef = collection(db, "parkingspaces");
    const [listView, setListView] = useState(true);
    const [search, setSearch] = useState("");
    const searchQuery = query(parkingSpacesRef, where("name", ">=", search));
    const [modalActive, setModalActive] = useState(false);
    const [checked, setChecked] = useState(false);
    const [filterPermits, setFilterPermits] = useState([]);
    const permitTypes = ['S', 'D', 'E', 'R', 'GZ8', 'GZ1'];

    const toggleListView = () => {
        setListView(!listView);
    };

    // console.log(search);
    // console.log(parkingSpaces);

    useEffect(() => {
        if (search) {
            const unsubscribe = onSnapshot(searchQuery, (querySnapshot) => {
                const updatedData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // console.log(updatedData);
                setParkingSpaces(updatedData);
            });

            return () => unsubscribe();
        } else {
            const unsubscribe = onSnapshot(parkingSpacesRef, (querySnapshot) => {
                const updatedData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                // console.log(updatedData);
                setParkingSpaces(updatedData);
            });
        
            return () => unsubscribe();
        }
    }, [search]);
    
    // const postToBackend = async () => {
    //     try {
    //         console.log("trying");
    //         const response = await fetch('http://3.231.59.242:5000/sensordata', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ sensorToken: "ZCf6xc$cHJ@y4Tre3Sz4BeoC*RsWr9!C", status: true })
    //         });
    
    //         if (response.ok) {
    //             console.log('Success');
    //         } else {
    //             const error = await response.text();
    //             console.error(error);
    //         }
    
    //         const data = await response.text();
    //         console.log(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    
    // postToBackend();

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

    const handleCheckboxChange = (permitType) => {
        const isPermitSelected = filterPermits.includes(permitType);
        if (isPermitSelected) {
          setFilterPermits(filterPermits.filter((permit) => permit !== permitType));
        } else {
          setFilterPermits([...filterPermits, permitType]);
        }
      };

    //   console.log(filterPermits);

    return (
        <SafeAreaView className="bg-white h-screen">
            <Stack.Screen options={{
                headerTitle: "Spot Availability", 
                headerShown: true, 
                headerTitleStyle: {fontSize: 28},
                headerBackTitle: "Back",
                headerShadowVisible: false,
                headerRight: () => (
                    <TouchableOpacity 
                    onPress={() => setModalActive(!modalActive)}
                    className="mr-2 p-2">
                        <Text className="text-lg text-emerald-800 font-semibold">Filter</Text>
                    </TouchableOpacity>
                )
            }}/>

            <Modal
            animationType="fade"
            transparent={true}
            visible={modalActive}
            onRequestClose={() => {setModalActive(!modalActive);}}
            >
                <View className="relative flex justify-center items-center h-screen">
                    <TouchableOpacity className="absolute h-screen w-full bg-black opacity-60"
                    onPress={() => setModalActive(!modalActive)}
                    />
                    <View className="bg-white flex justify-between items-center w-[75%] rounded-xl mb-5">
                        <Text className="pt-4 px-4 text-base font-bold text-center mb-3">Filter</Text>
                        {permitTypes.map((permitType) => (
                            <Checkbox.Item
                            key={permitType}
                            status={filterPermits.includes(permitType) ? 'checked' : 'unchecked'}
                            label={`${permitType} permit`}
                            color="#065f46"
                            position="trailing"
                            style={{paddingHorizontal: 86, justifyContent: "center", alignItems: "center"}}
                            onPress={() => handleCheckboxChange(permitType)}
                            />
                        ))}

                        <View className="flex flex-row justify-between w-full mt-3">
                            <TouchableOpacity className="flex justify-center items-center border-t-[1px] border-r-[0.5px] border-neutral-200 w-full py-3 rounded-b-xl"
                            onPress={() => setModalActive(!modalActive)}
                            >
                                <Text className="font-medium text-base">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false} className="flex flex-col min-w-full space-y-4 px-4 pt-4">

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

                <View className="flex flex-row min-w-full justify-center">
                    <View className="flex flex-row bg-neutral-100 rounded-full p-[1px] border-[1px] border-neutral-200">
                        <TouchableOpacity className={`${listView ? 'bg-emerald-800' : 'bg-neutral-100'} py-3 px-5 rounded-full`} onPress={toggleListView}>
                            <Text className={`${listView ? 'text-white' : 'text-black'} font-semibold`}>List View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`${!listView ? 'bg-emerald-800' : 'bg-neutral-100'} py-3 px-5 rounded-full`} onPress={toggleListView}>
                            <Text className={`${!listView ? 'text-white' : 'text-black'} font-semibold`}>Card View</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {!listView && (
                    <View className="space-y-4 mb-[57%]">
                        {parkingSpaces && parkingSpaces.filter((parkingSpace) => filterPermits.every((filterPermit) => parkingSpace.permits.includes(filterPermit))).map((space) => (
                            <TouchableOpacity
                            onPress={() => { router.push({ pathname: `/parkingspace/${space.id}`, params: { id: space.id }})}}
                            key={space.id} 
                            className="flex flex-col space-y-2">
                                <Image source={{uri: space.image}} className="aspect-[16/12] flex rounded-xl" progressiveRenderingEnabled={true}/>
                                <Text className="text-xl font-bold" numberOfLines={1}>{space.name}</Text>
                                <View>
                                    <Text style={styles.cardTextLg} className="font-semibold">Permits {space.permits.join(', ')}</Text>
                                    <Text style={styles.cardTextLg} className="text-neutral-500">{space.openspots} available spots</Text>
                                </View>
                                <Text style={styles.cardTextBase}className="font-light text-neutral-400">{lastUpdated(space.lastupdated)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {listView && (
                    <View className="space-y-4 mb-[57%]">
                    {parkingSpaces && parkingSpaces.filter((parkingSpace) => filterPermits.every((filterPermit) => parkingSpace.permits.includes(filterPermit))).map((space) => (
                        <TouchableOpacity 
                        onPress={() => { router.push({ pathname: `/parkingspace/${space.id}`, params: { id: space.id }})}}
                        key={space.id} 
                        className="flex flex-row justify-between space-x-2">
                            <Image source={{uri: space.image}} className="aspect-square flex rounded-md" progressiveRenderingEnabled={true}/>
                            <View className="flex flex-col flex-grow space-y-2 border-b border-b-neutral-200 pb-1 w-[74%]">
                                <Text style={styles.cardTextBase} className="font-bold w-[97%]" numberOfLines={1}>{space.name}</Text>
                                <View>
                                    <Text style={styles.cardTextMd}className="font-semibold">Permits {space.permits.join(', ')}</Text>
                                    <Text style={styles.cardTextMd} className="text-neutral-500">{space.openspots} available spots</Text>
                                </View>
                                <Text className="text-right font-light text-neutral-400">{lastUpdated(space.lastupdated)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    </View>
                )}
            </ScrollView>

        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
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