import { Stack } from "expo-router";
import { StatusBar } from "react-native"
import { router } from "expo-router";
import { auth } from "./config/firebase";
import { useEffect } from "react";

const Layout = () => {
    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
             if (!user) {
                router.replace('/intro');
            }
        })

        return unsubscribe;
    }, []);
    
    return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
    </Stack>
    )
}

export default Layout;