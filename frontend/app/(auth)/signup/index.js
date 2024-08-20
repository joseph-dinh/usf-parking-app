import { useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { router, Stack } from "expo-router";
import { collection, setDoc, doc } from "firebase/firestore";
import DropdownComp from "../../components/dropdowncomp";

const firebaseAuth = auth;
const firestoreDb = db;
const nameRegex = /^[A-Za-z]+$/;

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [permit, setPermit] = useState("");

    const [nameVal, setNameVal] = useState({
        styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4",
        msg: ""
    });
    const [emailVal, setEmailVal] = useState({
        styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4",
        msg: ""
    });
    const [passwordVal, setPasswordVal] = useState({
        styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4",
        msg: ""
    });
    const [permitVal, setPermitVal] = useState({
        borderColor: "#e5e7eb",
        msg: ""
    });

    // console.log(firebaseAuth?.currentUser?.email);

    const signUp = async () => {
        // Reset Validation
        setNameVal({ ...nameVal, msg: "", styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4" });
        setEmailVal({ ...emailVal, msg: "", styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4" });
        setPasswordVal({ ...passwordVal, msg: "", styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4" });
        setPermitVal({ ...permitVal, msg: "", borderColor: "#e5e7eb"});
        // console.log(email, password);

        // Input Validation
        if (!email || !password || !permit || !name) {
            if (!permit) {
                setPermitVal({...permitVal, msg: "Please select a permit", borderColor: "#ef4444"});
            }
    
            if (!name) {
                setNameVal({ ...nameVal, msg: "Please enter a valid name", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
    
            if (!email) {
                setEmailVal({ ...emailVal, msg: "Please enter a valid email", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
    
            if (!password) {
                setPasswordVal({ ...passwordVal, msg: "Please enter a valid password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
            return;
        }

        if (name) {
            if (!nameRegex.test(name)) {
                setNameVal({ ...nameVal, msg: "Invalid name format", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                return;
            }
        }
        
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = firebaseAuth.currentUser;
            const usersCollection = collection(firestoreDb, 'users');

            console.log(user.uid, user.email, name, permit);

            await setDoc(doc(usersCollection, user.uid), {
                uid: user.uid,
                email: user.email,
                name: name,
                permit: permit,
                recents: [],
                favorites: [],
            });

            await sendEmailVerification(user);

            router.push("/signin");
        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setEmailVal({ ...emailVal, msg: "Please enter a valid email", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            } else if (error.code === "auth/weak-password") {
                setPasswordVal({ ...passwordVal, msg: "Password should be at least 6 characters", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            } else if (error.code === "auth/email-already-in-use") {
                setEmailVal({ ...emailVal, msg: "Account already exists", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            } else if (error.code === "auth/too-many-requests, please try again later") {
                setEmailVal({ ...emailVal, msg: "Too many requests", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                setPasswordVal({ ...passwordVal, msg: "Too many requests, please try again later", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            } else if (error.code ==="auth/missing-password") {
                setPasswordVal({ ...passwordVal, msg: "Please enter a valid password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
            else {
                setEmailVal({ ...emailVal, msg: "An unexpected error occurred, please try again later", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                setPasswordVal({ ...passwordVal, msg: "An unexpected error occurred, please try again later", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
            console.log(error);
        }
    };

    return (
        <View className="bg-white px-5 min-h-screen gap-y-4">
            <Stack.Screen options={{
                headerTitle: "Sign Up",
                headerShown: true, 
                headerTitleStyle: {fontSize: 30, color: "#065f46"},
                headerTintColor: "#15803d"
                 }}/>

            <View className="pt-5">
                <TextInput 
                className={nameVal.styles}
                placeholder="Name"
                placeholderTextColor={"#9ca3af"}
                value={name}
                required={true}
                onChangeText={(text) => setName(text)}
                />
                <Text className="text-red-500 mt-1">{nameVal.msg}</Text>
            </View>

            <View className="">
                <TextInput 
                className={emailVal.styles}
                placeholder="Email"
                placeholderTextColor={"#9ca3af"}
                value={email}
                required={true}
                onChangeText={(text) => setEmail(text)}
                />
                <Text className="text-red-500 mt-1">{emailVal.msg}</Text>
            </View>
            
            <View className="">
                <TextInput 
                className={passwordVal.styles}
                placeholder="Password"
                placeholderTextColor={"#9ca3af"}
                value={password}
                required={true}
                // secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                />
                <Text className="text-red-500 mt-1">{passwordVal.msg}</Text>
            </View>

            <View>
                <DropdownComp value={permit} setValue={setPermit} borderColor={permitVal.borderColor}/>
                <Text className="text-red-500 mt-1">{permitVal.msg}</Text>
            </View>
            
            <View className="">
                <TouchableOpacity 
                className="bg-emerald-800 rounded-lg p-4 min-w-full" 
                onPress={() => {signUp(); Keyboard.dismiss()}}>
                    <Text className="text-center text-white">Sign Up</Text>
                </TouchableOpacity>
                {/* <Link href="/signup" className="text-emerald-800 text-center p-2 min-w-full">Sign In</Link> */}
            </View>

        </View>
    )
};

export default SignUp;