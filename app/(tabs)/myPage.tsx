import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FoodType, fetchFood } from "@/app/fetch";
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
    console.log(foodItem);
    
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Show food names */}
        {!selectedFood ? (
          <View style={styles.titleContainer}>
            <Text style={styles.outerTitle}>Gemte madvarer</Text>
            <View style={styles.outerContainer}>
              {food.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleFoodClick(item)} style={styles.foodItem}>
                  <Text style={styles.textBlack}>{item.name}</Text>
                </TouchableOpacity>
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
  outerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    // alignSelf: "center"
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#407088",
    padding: 20,
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
    color: "#fff",
  },
  foodItem: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffb5b5",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3d5a80",
    borderRadius: 5,
    alignItems: "center",
  },
});
