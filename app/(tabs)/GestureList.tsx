import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FoodType, fetchFood, deleteFoodItem } from "@/app/fetch";
import { firestore } from "@/firebaseConfig";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface FoodItemProps {
  foodItem: FoodType;
  index: number;
  handleFoodClick: (foodItem: FoodType) => void;
  handleDeleteFood: (foodItem: FoodType) => void;
  handleDragEnd: (index: number, newIndex: number) => void;
  foodList: FoodType[];
}

export default function GestureList() {
  const [food, setFood] = useState<FoodType[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);

  useEffect(() => {
    const unsubscribe = fetchFood(firestore, setFood);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle food name click
  const handleFoodClick = (foodItem: FoodType) => {
    setSelectedFood(foodItem);
    console.log(foodItem);
  };

  // Handle delete food item
  const handleDeleteFood = (foodItem: FoodType) => {
    console.log("Delete food item:", foodItem);
    deleteFoodItem(foodItem);
  };

  // Reorder food items in the list after drag
  const handleDragEnd = (index: number, newIndex: number) => {
    const newFoodList = [...food];
    const movedItem = newFoodList.splice(index, 1)[0];
    newFoodList.splice(newIndex, 0, movedItem);
    setFood(newFoodList);
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Show food names */}
        {!selectedFood ? (
          <View style={styles.titleContainer}>
            <Text style={styles.outerTitle}>Gemte madvarer</Text>
            <View style={styles.outerContainer}>
              {food.map((item, index) => (
                <FoodItem key={item.id} index={index} foodItem={item} handleFoodClick={handleFoodClick} handleDeleteFood={handleDeleteFood} handleDragEnd={handleDragEnd} foodList={food} />
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
            {selectedFood.ingredients ? <Text style={styles.textWhite}>{selectedFood.ingredients}</Text> : <Text style={styles.textWhite}>Ingredienser er ikke tilgængelige for denne madvare.</Text>}
            <Pressable onPress={() => setSelectedFood(null)} style={styles.backButton}>
              <Text style={styles.textWhite}>Tilbage til listen</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const FoodItem = ({ foodItem, index, handleFoodClick, handleDeleteFood, handleDragEnd, foodList }: FoodItemProps) => {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      "worklet";
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      "worklet";
      const newIndex = translateY.value > 0 ? index + 1 : index - 1;
      if (newIndex >= 0 && newIndex < foodList.length) {
        runOnJS(handleDragEnd)(index, newIndex);
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.foodItem, animatedStyle]}>
        <Pressable onPress={() => handleFoodClick(foodItem)} style={styles.foodItemRow}>
          <Text style={styles.textBlack}>{foodItem.name}</Text>
          <Pressable onPress={() => handleDeleteFood(foodItem)}>
            <Ionicons name="trash" size={24} color="white" />
          </Pressable>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3d5a80",
    borderRadius: 5,
    alignItems: "center",
  },
});

// const styles = StyleSheet.create({
//   outerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   outerContainer: {
//     flex: 1,
//     backgroundColor: "#407088",
//     padding: 10,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   titleContainer: {
//     flex: 1,
//     backgroundColor: "#407088",
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     resizeMode: "contain",
//     marginBottom: 20,
//     alignSelf: "center",
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   textBlack: {
//     color: "black",
//   },
//   textWhite: {
//     color: "#fff",
//   },
//   foodItem: {
//     borderWidth: 2,
//     borderRadius: 10,
//     borderColor: "#000",
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: "#ffb5b5",
//     // Use boxShadow instead of shadow*
//     boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
//   },

//   foodItemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#3d5a80",
//     borderRadius: 5,
//     alignItems: "center",
//   },
// });
