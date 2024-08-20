import { SafeAreaView, View, Text, Image, TouchableOpacity } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import { Auth } from "./components/auth";

const testImage = { uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg' };

const Home = () => {
    return (
        <SafeAreaView className="bg-white flex flex-col justify-between h-screen">
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            >
            </Stack.Screen>
            <ScrollView className="flex space-y-5">
                <View className="flex flex-row justify-between items-center mx-4">
                    <TouchableOpacity>
                        <Text className="text-green-600 text-lg font-medium">Back</Text>
                    </TouchableOpacity>
                    <Text className="text-3xl font-medium">Availability</Text>
                    <TouchableOpacity>
                        <Text className="text-green-600 text-lg font-medium">Filter</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                className="flex min-h-[5%] bg-gray-100 border-[1px] rounded-full mx-4 border-gray-200 p-4 placeholder:font-medium placeholder:text-base"
                placeholder="Search"
                placeholderTextColor="#9ca3af"/>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
                <View className="flex flex-row space-x-2 items-start">
                    <Image 
                    source={{uri: 'https://www.perry-mccall.com/wp-content/uploads/2017/08/0d463df53b104bc79ca4caaded7b051c.jpeg'}}
                    className="aspect-square rounded-xl w-[25%] h-[25%] ml-4"
                    />
                    <View className="flex flex-col mr-4">
                        <Text className="font-semibold text-base">Richard A Beard Parking Facility</Text>
                        <Text className="font-semibold mt-4">Permits D, GZ8, R, S</Text>
                        <Text className="text-gray-500">14 Available Spots</Text>
                        <Text className="text-gray-500 text-right">1m ago</Text>
                    </View>
                </View>
            </ScrollView>
            <View className="flex flex-row justify-evenly border-t-[1px] border-gray-200 pt-2">
                <TouchableOpacity className="flex w-16 h-16 rounded-full bg-gray-200"/>
                <TouchableOpacity className="flex w-16 h-16 rounded-full bg-gray-200"/>
                <TouchableOpacity className="flex w-16 h-16 rounded-full bg-gray-200"/>
                <TouchableOpacity className="flex w-16 h-16 rounded-full bg-gray-200"/>
            </View>
            <Auth/>
        </SafeAreaView>
    )
}

export default Home;