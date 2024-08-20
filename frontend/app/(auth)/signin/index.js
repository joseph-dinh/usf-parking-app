import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../config/firebase";
import { Link } from "expo-router";
import { router } from "expo-router";
import { StatusBar } from "react-native";

const SignIn = () => {
    StatusBar.setBarStyle('dark-content');
    const firebaseAuth = auth;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailVal, setEmailVal] = useState({
        styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4",
        msg: ""
    });
    const [passwordVal, setPasswordVal] = useState({
        styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4",
        msg: ""
    });

    // console.log(firebaseAuth?.currentUser?.email);

    const signIn = async () => {
        // Reset Validation
        setEmailVal({ ...emailVal, msg: "", styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4" });
        setPasswordVal({ ...passwordVal, msg: "", styles: "bg-gray-100 border-[1px] rounded-lg border-gray-200 p-4" });
        console.log(email, password);

        // Input Validation
        if (!email && !password) {
            setEmailVal({ ...emailVal, msg: "Please enter a valid email", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            setPasswordVal({ ...passwordVal, msg: "Please enter a valid password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            return;
        } else if (!email) {
            console.log("NO EMAIL")
            setEmailVal({ ...emailVal, msg: "Please enter a valid email", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            return;
        } else if (!password) {
            console.log("NO PASSWORD")
            setPasswordVal({ ...passwordVal, msg: "Please enter a valid password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            return;
        }
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            
            const user = firebaseAuth.currentUser;

            console.log(user.uid, user.email);

            router.replace("/");
        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setEmailVal({ ...emailVal, msg: "Please enter a valid email", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                console.log("test", error.code)
                return;
            } else if (error.code === "auth/invalid-login-credentials") {
                setEmailVal({ ...emailVal, msg: "Incorrect username or password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                setPasswordVal({ ...passwordVal, msg: "Incorrect username or password", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                return;
            } else if (error.code === "auth/too-many-requests") {
                setEmailVal({ ...emailVal, msg: "Access to this account has been temporarily disabled", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                setPasswordVal({ ...passwordVal, msg: "Access to this account has been temporarily disabled", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                return;
            } else{
                setEmailVal({ ...emailVal, msg: "An unexpected error occurred, please try again later", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
                setPasswordVal({ ...passwordVal, msg: "An unexpected error occurred, please try again later", styles: "bg-gray-100 border-[1px] rounded-lg border-red-500 p-4"});
            }
        }
    };

    return (
        <View className="bg-white px-5 min-h-screen gap-y-4">
            <Stack.Screen options={ { headerTitle: "Sign In", headerShown: true, headerTitleStyle: {fontSize: 30, color: "#065f46"} } }/>

            <View className="pt-5">
                <TextInput 
                className={emailVal.styles}
                placeholder="Email"
                placeholderTextColor={"#9ca3af"}
                value={email}
                required={true}
                maxLength={320}
                onChangeText={(text) => setEmail(text)}
                />
                <Text className="text-red-500 mt-1">{emailVal.msg}</Text>
            </View>
            
            <View>
                <TextInput 
                className={passwordVal.styles}
                placeholder="Password"
                placeholderTextColor={"#9ca3af"}
                value={password}
                required={true}
                // textContentType="password"
                secureTextEntry={false}
                maxLength={25}
                onChangeText={(text) => setPassword(text)}
                />
                <Text className="text-red-500 mt-1">{passwordVal.msg}</Text>
            </View>

            <View className="gap-y-1">
                <TouchableOpacity 
                className="bg-emerald-800 rounded-lg p-4 min-w-full" 
                onPress={signIn}>
                    <Text className="text-center text-white">Sign In</Text>
                </TouchableOpacity>
                <Link href="/signup" className="text-emerald-800 text-center p-2">Sign Up</Link>
            </View>

        </View>
    )
};

export default SignIn;