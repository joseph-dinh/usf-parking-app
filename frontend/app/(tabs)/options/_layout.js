import { Stack } from "expo-router";
import { StatusBar } from "react-native"

const Layout = () => {
    StatusBar.setBarStyle('dark-content');

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //          if (!user) {
    //             router.replace('/signin');
    //         }
    //     })

    //     return unsubscribe;
    // }, []);
    
    return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
    )
}

export default Layout;