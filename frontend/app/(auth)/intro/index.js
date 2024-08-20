import { StyleSheet, View, ImageBackground, TouchableOpacity, Text, Image } from "react-native"
import { Stack, router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import intropic from "../../assets/intropic.png"
import headertitle from "../../assets/headertitle.png"

export default function Intro() {
    return (
        <ImageBackground
        source={intropic}
        resizeMode="cover"
        style={styles.image}
        progressiveRenderingEnabled={true}
        >
            <View style={styles.overlay} className="h-full">
                <SafeAreaView>
                    <Stack.Screen options={{
                        headerShown: false, 
                    }}/>
                    <View className="flex flex-col h-full justify-between items-center">
                        <Image source={headertitle} className="mt-5"/>
                        <TouchableOpacity 
                        className="flex flex-row bg-emerald-700 rounded-lg py-4 w-[60%] items-center justify-center mb-20 space-x-3"
                        onPress={() => router.replace('/signin')}
                        >
                            <Text className="text-xl font-semibold text-white">Find Parking</Text>
                            <MaterialCommunityIcons name="arrow-right" size={25} color={"white"}/>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
    },
    text: {
      color: 'white',
      fontSize: 42,
      lineHeight: 84,
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#000000c0',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.134)', // Black overlay with 50% opacity
    }
  });