import { Text, View, StyleSheet, ScrollView, Image, Pressable, Alert, TextInput, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { FoodType, fetchFood, deleteFoodItem } from "@/app/fetch";
import { firestore } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { login, auth, app } from "@/firebaseConfig";
import { onAuthStateChanged, getAuth, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
// import {  initializeAuth, getReactNativePersistence} from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// web or device
// let auth: any;
// if (Platform.OS === "web") {
//   auth = getAuth(app);
// } else {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// }

export default function MyMess() {
  const [food, setFood] = useState<FoodType[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);

  const [loggedIn, setLoggedIn] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState("lise@email.test");
  const [enteredPassword, setEnteredPassword] = useState("test1234");
  const [userId, setUserId] = useState<string | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = fetchFood(firestore, setFood);

    // kaldes når componenten ikke længere er aktiv
    return () => unsubscribe();
  }, []);

  // handle log in state
  useEffect(() => {
    const auth_ = getAuth();
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      // if we´re logged in set user id
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });
    // kaldes når componenten ikke længere er aktiv
    return () => unsubscribe();
  });

  // Handle login
  const handleLogin = async () => {
    try {
      const user = await login(enteredEmail, enteredPassword);
      setUserId(user.uid);
      setLoggedIn(true);
    } catch (error) {
      Alert.alert("Login Failed");
      setLoggedIn(false);
    }
  };

  async function handleSignup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      console.log("Oprettet ny bruger: ", userCredential.user.uid);
    } catch (error) {
      console.error("ny bruger blev ikke oprettet");
      Alert.alert("ny bruger blev ikke oprettet");
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    setLoggedIn(false);
  }

  // Handle food name click
  const handleFoodClick = (foodItem: FoodType) => {
    setSelectedFood(foodItem);
    // console.log(foodItem);
  };

  // Handle delete food item
  const handleDeleteFood = (foodItem: FoodType) => {
    Alert.alert(
      foodItem.name,
      "Er du sikker på du vil slette denne madvare??",
      [
        {
          text: "Annullér",
          style: "cancel",
        },
        {
          text: "Slet",
          style: "destructive",
          onPress: () => {
            console.log("Delete food item:", foodItem);
            deleteFoodItem(foodItem);
          },
        },
      ],
      { cancelable: true }
    );
  };

  function onGestureEvent(event: any) {
    const { translationX, translationY } = event.nativeEvent;
    console.log("X: ", translationX);
    console.log("Y: ", translationY);
  }

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      "worklet";
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  if (!loggedIn) {
    return (
      <View style={[styles.container, styles.outerContainer, styles.loginSignup]}>
        <View>
          <Text style={styles.title}>Login</Text>
          <TextInput style={styles.foodItem} onChangeText={(newText) => setEnteredEmail(newText)} value={enteredEmail} />
          <TextInput style={styles.foodItem} onChangeText={(newText) => setEnteredPassword(newText)} value={enteredPassword} />
          <Pressable style={styles.backButton} onPress={handleLogin}>
            <Text style={styles.textWhiteBold}>Log Ind</Text>
          </Pressable>
          {/* <Button title="Log in" onPress={handleLogin} /> */}
        </View>
        <View>
          <Text style={styles.title}>Opret profil</Text>
          <TextInput style={styles.foodItem} onChangeText={(newText) => setEnteredEmail(newText)} value={enteredEmail} />
          <TextInput style={styles.foodItem} onChangeText={(newText) => setEnteredPassword(newText)} value={enteredPassword} />
          <Pressable style={styles.backButton} onPress={handleSignup}>
            <Text style={styles.textWhiteBold}>Opret Profil</Text>
          </Pressable>
          {/* <Button title="Signup" onPress={signup} /> */}
        </View>
      </View>
    );
  }

  if (userId) {
    return (
      <GestureHandlerRootView style={styles.rootView}>
        <View style={styles.outerContainer}>
          <View style={styles.foodItemRow}>
            <Text style={styles.title}>User: {enteredEmail}</Text>
            <Pressable style={styles.backButton} onPress={handleSignOut}>
              <Text style={styles.textWhiteBold}>Logud</Text>
            </Pressable>
            {/* <Button style={styles.backButton} title="Log ud" onPress={handleSignOut} /> */}
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[ animatedStyle]}>
                {/* Show food names */}
                {!selectedFood ? (
                  <View style={styles.titleContainer}>
                    <Text style={styles.outerTitle}>Gemte madvarer</Text>
                    <View style={styles.outerContainer}>
                      {food.map((item) => (
                        <Pressable key={item.id} onPress={() => handleFoodClick(item)} style={styles.foodItem}>
                          <View style={styles.foodItemRow}>
                            <Text style={styles.textBlack}>{item.name}</Text>
                            <Pressable onPress={() => handleDeleteFood(item)}>
                              <Ionicons name="trash" size={24} color="white" />
                            </Pressable>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : (
                  // Show details of the selected food
                  <View key={selectedFood.id} style={styles.container}>
                    <Text style={[styles.name, styles.textWhite]}>{selectedFood.name}</Text>
                    <Image
                      source={{
                        uri: selectedFood.imageUri || "https://cdn.creazilla.com/icons/3433516/food-icon-md.png",
                      }}
                      style={styles.image}
                    />
                    <Text style={[styles.title, styles.textWhite]}>Næringsindhold (pr. 100g):</Text>
                    <Text style={styles.textWhite}>Energi: {selectedFood.nutrients.energy} kcal</Text>
                    <Text style={styles.textWhite}>Fedt: {selectedFood.nutrients.fat}g</Text>
                    <Text style={styles.textWhite}>Mættet Fedt: {selectedFood.nutrients.saturatedFat}g</Text>
                    <Text style={styles.textWhite}>Kulhydrater: {selectedFood.nutrients.carbs}g</Text>
                    <Text style={styles.textWhite}>Heraf Sukker: {selectedFood.nutrients.sugars}g</Text>
                    <Text style={styles.textWhite}>Protein: {selectedFood.nutrients.protein}g</Text>
                    <Text style={styles.textWhite}>OBS: Tallene kan være forkerte/forældede</Text>
                    <Text style={[styles.title, styles.textWhite]}>Ingredienser:</Text>
                    {selectedFood.ingredients ? (
                      <Text style={styles.textWhite}>{selectedFood.ingredients}</Text>
                    ) : (
                      <Text style={styles.textWhite}>Ingredienser er ikke tilgængelige for denne madvare.</Text>
                    )}
                    {/* Button to go back to the list */}
                    <Pressable style={styles.backButton} onPress={() => setSelectedFood(null)}>
                      <Text style={styles.textWhiteBold}>Tilbage til listen</Text>
                    </Pressable>
                    {/* <Pressable onPress={() => setSelectedFood(null)} style={styles.backButton}>
                <Text style={styles.textWhite}>Tilbage til listen</Text>
              </Pressable> */}
                  </View>
                )}
              </Animated.View>
            </GestureDetector>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    );
  }
  return (
    <View>
      <View>
        <Text>log venligst ind</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "blue",
    margin: 30,
  },

  rootView: {
    flex: 1,
  },
  outerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#407088",
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    backgroundColor: "#407088",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textBlack: {
    color: "black",
  },
  textWhite: {
    color: "white",
  },
  textWhiteBold: {
    color: "white",
    fontWeight: 800,
  },
  foodItem: {
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000",
    padding: 10,
    backgroundColor: "#ffb5b5",
    // Use boxShadow instead of shadow*
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
  },
  foodItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgb(63 151 246)",
    borderRadius: 5,
    alignItems: "center",
  },
  loginSignup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
