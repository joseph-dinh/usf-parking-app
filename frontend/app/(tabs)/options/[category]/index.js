import { useState, useEffect } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { auth } from "../../../config/firebase"
import { doc, collection, getDoc, setDoc, update, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { updateProfile, updateEmail, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropdownCompSet from "../../../components/dropdowncompset";
import * as ImagePicker from 'expo-image-picker';
import { FileSystem } from "expo";

export default function Page() {
  console.log(auth.currentUser.uid);
  const params = useLocalSearchParams();
  console.log(params.category);
  console.log(auth.currentUser);
  router.canGoBack(false);
  const userRef = doc(collection(db, "users"), auth.currentUser.uid);
  const [userData, setUserData] = useState();
  const firestoreDb = db;

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

  console.log(userData);

  if (params.category == "Name") {
    const [newName, setNewName] = useState("");

    const updateDisplayName = async (newName) => {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newName
        });
        router.back();
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <SafeAreaView className="bg-white h-screen">
        <Stack.Screen options={{
            headerTitle: params.category, 
            headerShown: true, 
            headerTitleStyle: {fontSize: 28, color: "black"},
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontSize: 18 },
            headerTintColor: "#065f46",
        }}/>

        <View className="mt-10 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="account-outline" color={"#d4d4d4"} size={30}/>
          <TextInput
            style={styles.cardTextLg}
            className="justify-between items-center py-5 w-[85%]"
            placeholder={auth.currentUser.displayName}
            placeholderTextColor={"#9ca3af"}
            value={newName}
            onChangeText={(text) => setNewName(text)}
            />
        </View>

        <TouchableOpacity className={newName ? "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-green-700 shadow-md rounded-lg" : "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-neutral-300 shadow-md rounded-lg"}
        onPress={() => {newName && updateDisplayName(newName)}}
        >
            <Text className="text-lg font-medium text-white">Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  } else if (params.category == "Email") {
    const [newEmail, setNewEmail] = useState("");

    const updateUserEmail = async (newEmail) => {
      try {
        await updateEmail(auth.currentUser, newEmail);
        router.back();
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <SafeAreaView className="bg-white h-screen">
        <Stack.Screen options={{
            headerTitle: params.category, 
            headerShown: true, 
            headerTitleStyle: {fontSize: 28, color: "black"},
            
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontSize: 18 },
            headerTintColor: "#065f46",
        }}/>

        <View className="mt-10 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="email-outline" color={"#d4d4d4"} size={30}/>
          <TextInput
            style={styles.cardTextLg}
            className="justify-between items-center py-5 w-[85%]"
            placeholder={auth.currentUser.email}
            placeholderTextColor={"#9ca3af"}
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
            />
        </View>

        <TouchableOpacity className={newEmail ? "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-green-700 shadow-md rounded-lg" : "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-neutral-300 shadow-md rounded-lg"}
        onPress={() => {newEmail && updateUserEmail(newEmail)}}
        >
            <Text className="text-lg font-medium text-white">Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  } else if (params.category == "Password") {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const updateUserPassword = async (oldPassword, newPassword) => {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword,
      );
      console.log(credential);
      console.log(oldPassword, newPassword);
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        console.log("sucess");
        await updatePassword(auth.currentUser, newPassword);
        console.log("good");
        await auth.signOut();
      } catch(error) {
        console.error(error);
      }
    }

    return (
      <SafeAreaView className="bg-white h-screen">
        <Stack.Screen options={{
            headerTitle: params.category, 
            headerShown: true, 
            headerTitleStyle: {fontSize: 28, color: "black"},
            
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontSize: 18 },
            headerTintColor: "#065f46",
        }}/>

        <View className="mt-10 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="lock-minus-outline" color={"#d4d4d4"} size={30}/>
          <TextInput
            style={styles.cardTextLg}
            className="justify-between items-center py-5 w-[85%]"
            placeholder={"Current Password"}
            placeholderTextColor={"#9ca3af"}
            value={oldPassword}
            secureTextEntry={true}
            onChangeText={(text) => setOldPassword(text)}
            />
        </View>

        <View className="mt-4 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="lock-plus-outline" color={"#d4d4d4"} size={30}/>
          <TextInput
            style={styles.cardTextLg}
            className="justify-between items-center py-5 w-[85%]"
            placeholder={"New Password"}
            placeholderTextColor={"#9ca3af"}
            value={newPassword}
            secureTextEntry={true}
            onChangeText={(text) => setNewPassword(text)}
            />
        </View>

        <TouchableOpacity className={newPassword && oldPassword ? "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-green-700 shadow-md rounded-lg" : "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-neutral-300 shadow-md rounded-lg"}
        onPress={() => {oldPassword && newPassword && updateUserPassword(oldPassword, newPassword)}}
        >
            <Text className="text-lg font-medium text-white">Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  } else if (params.category == "Permits") {
    const [permit, setPermit] = useState("");
    const usersCollection = collection(firestoreDb, 'users');

    const updatePermit = async () => {
      try {
        await setDoc(doc(usersCollection, auth.currentUser.uid), {
          permit: permit
        });
        router.back();
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <SafeAreaView className="bg-white h-screen">
        <Stack.Screen options={{
            headerTitle: params.category, 
            headerShown: true, 
            headerTitleStyle: {fontSize: 28, color: "black"},
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontSize: 18 },
            headerTintColor: "#065f46",
        }}/>

        {/* <View className="mt-10 mx-8 px-4 flex flex-row items-center bg-white border-[1px] border-neutral-100 shadow-lg rounded-lg space-x-2">
          <MaterialCommunityIcons name="email-outline" color={"#d4d4d4"} size={30}/>
        </View> */}

        {/* <View className="flex justify-center items-center">
          <View className="rounded-full p-[6px] shadow-lg bg-white">
            <View className="flex justify-center items-center aspect-square bg-neutral-600 w-[50%] rounded-full"><Text style={styles.cardTextSXl} className="text-white">J</Text></View>
          </View>
        </View> */}

        <View className="mt-10 mx-8 shadow-lg rounded-lg">
          <DropdownCompSet value={permit} setValue={setPermit} borderColor={"white"} placeholderVal={userData?.permit}/>
        </View>

        <TouchableOpacity className={permit ? "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-green-700 shadow-md rounded-lg" : "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-neutral-300 shadow-md rounded-lg"}
        onPress={() => {permit && (updatePermit())}}
        >
            <Text className="text-lg font-medium text-white">Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  } else if (params.category == "Picture") {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
      });
  
      // console.log("HELLOLASLFOALOFASLOFAS", result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

  
    return (
      <SafeAreaView className="bg-white h-screen">
                <Stack.Screen options={{
            headerTitle: params.category, 
            headerShown: true, 
            headerTitleStyle: {fontSize: 28, color: "black"},
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontSize: 18 },
            headerTintColor: "#065f46",
        }}/>
        <View className="mt-8 flex w-full justify-center items-center">
          <TouchableOpacity className="rounded-full p-[6px] shadow-lg bg-white"
          onPress={() => pickImage()}
          >
            {image && <Image source={{uri: image}} className="aspect-square w-[50%] rounded-full"/>}
            {!image && <Image source={{uri: "https://i.ndtvimg.com/mt/movies/2013-06/channing-waxxx.jpg"}} className="aspect-square w-[50%] rounded-full"/>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity className={image ? "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-green-700 shadow-md rounded-lg" : "mt-4 mx-8 py-4 pl-4 pr-2 flex flex-row justify-center items-center bg-neutral-300 shadow-md rounded-lg"}
        onPress={() => {image && (updatePermit())}}
        >
            <Text className="text-lg font-medium text-white">Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
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
  cardTextSXl: {
    fontSize: 120,
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