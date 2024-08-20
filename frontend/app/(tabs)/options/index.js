import { useState } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Page() {
    const [modalVisible, setModalVisible] = useState(false);
    
    console.log(auth);

    const handleSignOut = () => {
        auth.signOut().then(() => {router.replace("/signin")}).catch(error => console.error(error));
    }

    return (
        <SafeAreaView className="h-screen bg-white px-4">
            <Stack.Screen options={{
                headerTitle: "Settings", 
                headerShown: true, 
                headerTitleStyle: {fontSize: 28, color: "black"},
                headerBackTitle: "Back",
                headerBackTitleStyle: { fontSize: 18 },
                headerTintColor: "#15803d",
            }}/>

            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
                <View className="relative flex justify-center items-center h-screen">
                    <TouchableOpacity className="absolute h-screen w-full bg-black opacity-60"
                    onPress={() => setModalVisible(!modalVisible)}
                    />
                    <View className="bg-white flex justify-between items-center w-[75%] aspect-[16/10] rounded-xl mb-5">
                        <Text className="pt-4 px-4 text-base font-bold text-center">Are you sure you want to delete your account?</Text>
                        <Text>This action cannot be undone.</Text>
                        <View className="flex flex-row justify-between w-full">
                            <TouchableOpacity className="flex justify-center items-center border-t-[1px] border-r-[0.5px] border-neutral-200 min-w-[50%] py-3 rounded-bl-xl"
                            onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text className="font-medium text-base">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex justify-center items-center border-t-[1px] border-l-[0.5px] border-neutral-200 min-w-[50%] py-3 rounded-br-xl">
                                <Text className="font-bold text-base text-red-500">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
                {/* <TextInput>Profile</TextInput> */}
                {/* <View className="flex flex-col space-y-2">
                    <Text>Name</Text>
                    <TextInput 
                        className="border border-neutral-300 p-4 rounded-lg" 
                        placeholder={auth.currentUser.displayName}
                        placeholderTextColor="#a3a3a3"
                        onChangeText={(text) => setSearch(text)}
                    />
                </View> */}

                <View className="pl-4 pr-3 space-y-4">
                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
                    onPress={() => { router.push({ pathname: `/options/name`, params: { category: "Name" }})}}
                    >
                        <MaterialCommunityIcons name="account-outline" color={"black"} size={30}/>
                        <Text className="text-lg font-medium">Name</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
                    onPress={() => { router.push({ pathname: `/settings/picture`, params: { category: "Picture" }})}}
                    >
                        <MaterialCommunityIcons name="panorama-outline" color={"black"} size={30}/>
                        <Text className="text-lg font-medium">Profile Picture</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
                    onPress={() => { router.push({ pathname: `/settings/email`, params: { category: "Email" }})}}
                    >
                        <MaterialCommunityIcons name="email-outline" color={"black"} size={30}/>
                        <Text className="text-lg font-medium">Email</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg">
                        <MaterialCommunityIcons name="lock-outline" color={"black"} size={30}/>
                        <Text className="text-lg font-medium">Password</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-white shadow-md rounded-lg"
                    onPress={handleSignOut}
                    >
                        <MaterialCommunityIcons name="exit-to-app" color={"black"} size={30}/>
                        <Text className="text-lg font-medium">Sign Out</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"black"} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex flex-row justify-between items-center py-4 pl-4 pr-2 bg-red-500 shadow-md rounded-lg"
                    onPress={() => setModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="delete-forever" color={"white"} size={30}/>
                        <Text className="text-lg font-medium text-white">Delete My Account</Text>
                        <MaterialCommunityIcons name="chevron-right" color={"white"} size={30} />
                    </TouchableOpacity>

    
                </View>

        </SafeAreaView>
    )
}