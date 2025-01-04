import { Alert } from "react-native";
import { useState } from "react";
import { addDoc, collection, getDocs, onSnapshot, Firestore } from "firebase/firestore";
import { firestore, storage } from "./firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface FoodType {
  id?: string | undefined;
  name: string;
  imageUri?: string;
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

export function fetchFood(firestore: Firestore, callback: (foods: FoodType[]) => void): () => void {
  const foodCollection = collection(firestore, "foodList");
  const unsubscribe = onSnapshot(
    foodCollection,
    (snapshot) => {
      const fetchedFoods: FoodType[] = snapshot.docs.map((doc) => {
        const foodData = doc.data();
        return {
          id: doc.id,
          name: foodData.name,
          imageUri: foodData.imageUri,
          nutrients: {
            energy: foodData.energy,
            fat: foodData.fat,
            saturatedFat: foodData.saturatedFat,
            carbs: foodData.carbs,
            sugars: foodData.sugars,
            protein: foodData.protein,
          },
          ingredients: foodData.ingredients || "",
        };
      });
      callback(fetchedFoods);
    },
    (error) => {
      console.error("Problem getting saved food", error);
    }
  );

  return unsubscribe;
}

// export async function fetchFood(): Promise<FoodType[]> {
//   return new Promise((resolve, reject) => {
//     try {
//       const foodCollection = collection(firestore, "foodList");
//       onSnapshot(foodCollection, (snapshot) => {
//         const fetchedFoods: FoodType[] = [];
//         snapshot.forEach((doc) => {
//           const data = doc.data();
//           fetchedFoods.push({
//             id: doc.id,
//             name: data.name || "Unknown", 
//             imageUri: data.imageUri || "", 
//             nutrients: {
//               energy: data.nutrients?.energy ?? 0, 
//               fat: data.nutrients?.fat ?? 0,
//               saturatedFat: data.nutrients?.saturatedFat ?? 0,
//               carbs: data.nutrients?.carbs ?? 0,
//               sugars: data.nutrients?.sugars ?? 0,
//               protein: data.nutrients?.protein ?? 0,
//             },
//             ingredients: data.ingredients || "",
//           });
//         });
//         console.log("Fetched Food Data:", fetchedFoods);
//         resolve(fetchedFoods);
//       });
//     } catch (error) {
//       console.error("Error fetching food:", error);
//       reject(error);
//     }
//   });
// }







export async function saveFood(newFood: FoodType) {
  console.log("handle save food");

  if (newFood) {
    try {
       let imageUrl = "";

      // Check if imageUri is defined
      if (newFood.imageUri) {

      // Upload image to Firestore Storage
      const imageRef = ref(storage, `foodImages/${newFood.name}`);
      const response = await fetch(newFood.imageUri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);

      // Get the download URL of the uploaded image
       imageUrl = await getDownloadURL(imageRef);

      console.log("food image saved");
      }

      const foodData: FoodType = {
        name: newFood.name,
        // Use the download URL or empty string
        imageUri: imageUrl,
        nutrients: {
          energy: newFood.nutrients.energy,
          fat: newFood.nutrients.fat,
          saturatedFat: newFood.nutrients.saturatedFat,
          carbs: newFood.nutrients.carbs,
          sugars: newFood.nutrients.sugars,
          protein: newFood.nutrients.protein,
        },
        ingredients: newFood.ingredients || "",
      };

      console.log("Food data being saved: ", foodData);

      const docRef = await addDoc(collection(firestore, "foodList"), foodData);
      console.log("food item id: ", docRef);

      console.log("Saved food item to Firestore", newFood);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Food saving error:", error.message);
        alert("Error saving new food: " + error.message);
      }
    }
  }
}

  // try {
    //   const foodCollection = collection(firestore, "foodList");
    //   const foodSnapshot = await getDocs(foodCollection);
    //   const fetchedFoods: FoodType[] = foodSnapshot.docs.map((doc) => {
    //     const foodData = doc.data();
    //     return {
    //       id: doc.id,
    //       name: foodData.name,
    //       image: foodData.imageUri,
    //       nutrients: {
    //         energy: foodData.energy,
    //         fat: foodData.fat,
    //         saturatedFat: foodData.saturatedFat,
    //         carbs: foodData.carbs,
    //         sugars: foodData.sugars,
    //         protein: foodData.protein,
    //       },
    //       ingredients: foodData.ingredients || "",
    //     };
    //   });
    //   console.log("Food from db");

    // return fetchedFoods;

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
