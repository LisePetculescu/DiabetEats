import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FoodType, fetchFood } from "@/fetch";
import { firestore } from "@/firebaseConfig";


export default function MyPage() {
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
  };

  return (
    <View style={styles.outerContainer}>

      <ScrollView contentContainerStyle={styles.outerContainer}>
        {/* Show food names */}
        {!selectedFood ? (
          <>
          <Text style={styles.name}>Her kan du se de madvarer du har gemt</Text>
         { food.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleFoodClick(item)} style={styles.foodItem}>
              <Text style={styles.textBlack}>{item.name}</Text>
            </TouchableOpacity>
          ))}
          </>
          
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

            {/* Button to go back to the list */}
            <TouchableOpacity onPress={() => setSelectedFood(null)} style={styles.backButton}>
              <Text style={styles.textWhite}>Tilbage til listen</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#407088",

    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 10,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#407088",
    // justifyContent: "center",
    // alignItems: "center",
    flexGrow: 1,
    padding: 10,
  },
  textWhite: {
    color: "#fff",
  },
  textBlack: {
    color: "#000",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
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
  foodItem: {
    // borderTopWidth: 1,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000",
    // borderColor: "#fff",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffb5b5",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3d5a80",
    borderRadius: 5,
  },
});
