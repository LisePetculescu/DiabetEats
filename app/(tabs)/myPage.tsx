import { Text, View, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebaseConfig.js";
import { FoodType, fetchFood } from "@/fetch.js";

// interface FoodType {
//   id?: string | undefined;
//   name: string;
//   image: string;
//   nutrients: {
//     energy: number;
//     fat: number;
//     saturatedFat: number;
//     carbs: number;
//     sugars: number;
//     protein: number;
//   };
//   ingredients: string;
// }

export default function myPage() {
  const [food, setFood] = useState<FoodType[]>([]);

  useEffect(() => {
    const getFood = async () => {
      try {
        const foodData = await fetchFood();
        setFood(foodData);
      } catch (error) {
        console.error("Problem getting saved food", error);
      }
    };

    getFood();
  }, []);

  // function fetchFood() {
  //   try {
  //     const getFood = onSnapshot(collection(firestore, "foodList"), (collectionData) => {
  //       const fetchedFoods: FoodType[] = [];
  //       collectionData.forEach((document) => {
  //         const foodData = document.data();
  //         food.push({
  //           id: document.id,
  //           name: foodData.name,
  //           image: foodData.image,
  //           nutrients: {
  //             energy: foodData.energy,
  //             fat: foodData.fat,
  //             saturatedFat: foodData.saturatedFat,
  //             carbs: foodData.carbs,
  //             sugars: foodData.sugars,
  //             protein: foodData.protein,
  //           },
  //           ingredients: foodData.ingredients,
  //         });
  //       });
  //       setFood(fetchedFoods);
  //       console.log("fetched food");
  //     });
  //     return getFood;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error fetching foodList:", error.message);
  //       Alert.alert("Error fetching foodList", error.message);
  //     } else {
  //       console.error("Unexpected error:", error);
  //       Alert.alert("Unexpected error occurred.");
  //     }
  //   }
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Her kan du se de madvarer du har gemt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#407088",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
