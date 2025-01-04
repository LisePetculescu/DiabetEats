import {  Alert } from "react-native";
import { useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "./firebaseConfig.js";

export interface FoodType {
  id?: string | undefined;
  name: string;
  image: string;
  nutrients: {
    energy: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    protein: number;
  };
  ingredients: string;
}

export async function fetchFood(): Promise<FoodType[]> {
  try {
    const foodCollection = collection(firestore, "foodList");
    const foodSnapshot = await getDocs(foodCollection);
    const fetchedFoods: FoodType[] = foodSnapshot.docs.map((doc) => {
      const foodData = doc.data();
      return {
        id: doc.id,
        name: foodData.name,
        image: foodData.image,
        nutrients: {
          energy: foodData.energy,
          fat: foodData.fat,
          saturatedFat: foodData.saturatedFat,
          carbs: foodData.carbs,
          sugars: foodData.sugars,
          protein: foodData.protein,
        },
        ingredients: foodData.ingredients,
      };
    });
    return fetchedFoods;
  } catch (error) {
    console.error("Problem getting saved food", error);
    throw error;
  }
}

export async function saveFood(newFood: FoodType) {
 console.log("handle save food");
 
} 

// export async function fetchFood(): Promise<FoodType[]> {
//   try {
//     const getFood = onSnapshot(collection(firestore, "foodList"), (collectionData) => {
//       const fetchedFoods: FoodType[] = [];
//       collectionData.forEach((document) => {
//         const foodData = document.data();
//         fetchedFoods.push({
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
//     //   setFood(fetchedFoods);
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

