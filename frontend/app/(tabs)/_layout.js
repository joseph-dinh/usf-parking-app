import { useEffect } from "react";
import { Stack, Tabs, router } from "expo-router";
import { auth } from "../config/firebase";
import { StatusBar } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSegments } from "expo-router";

const Layout = () => {
    StatusBar.setBarStyle('dark-content');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
             if (!user) {
                router.replace("signin");
            }
        })

        return unsubscribe;
    }, []);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#065f46",
            tabBarShowLabel: false,
        }}>
            <Tabs.Screen name="home" 
            options={{ headerShown: false, tabBarIcon: ({ color}) => (
                <MaterialCommunityIcons name="home" color={color} size={30} />
            )}}/>
            <Tabs.Screen name="activity" 
            options={{ headerShown: false, tabBarIcon: ({ color}) => (
                <MaterialCommunityIcons name="history" color={color} size={30} />
            )}}/>
            <Tabs.Screen name="profile" 
            options={{ unmountOnBlur: true, headerShown: false, tabBarIcon: ({ color}) => (
                <MaterialCommunityIcons name="account-outline" color={color} size={30} />
            )}}/>
            <Stack.Screen name="options"
            options={{
                href: null,
                headerShown: false,
                // tabBarStyle: { display: "none", }
                statusBarStyle: "dark"
            }}
            />
        </Tabs>
    )
}

export default Layout;