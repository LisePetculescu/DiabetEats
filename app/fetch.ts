import { Alert } from "react-native";
import { useState } from "react";
import { addDoc, collection, onSnapshot, Firestore, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { firestore, storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


export default {
  fetchFood,
  saveFood,
  deleteFoodItem,
};

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

// CRUD for saved fooditems

// CREATE
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
        name: newFood.name || "Ukendt",
        // Use the download URL or empty string
        imageUri: imageUrl,
        nutrients: {
          energy: newFood.nutrients.energy || 0,
          fat: newFood.nutrients.fat || 0,
          saturatedFat: newFood.nutrients.saturatedFat || 0,
          carbs: newFood.nutrients.carbs || 0,
          sugars: newFood.nutrients.sugars || 0,
          protein: newFood.nutrients.protein || 0,
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

// READ
export function fetchFood(firestore: Firestore, callback: (foods: FoodType[]) => void): () => void {
  const foodCollection = collection(firestore, "foodList");
  const unsubscribe = onSnapshot(
    foodCollection,
    (snapshot) => {
      const fetchedFoods: FoodType[] = snapshot.docs.map((doc) => {
        const foodData = doc.data();
        return {
          id: doc.id,
          name: foodData.name || "Unknown Food",
          imageUri: foodData.imageUri || "",
          nutrients: {
            energy: foodData.nutrients?.energy ?? 0,
            fat: foodData.nutrients?.fat ?? 0,
            saturatedFat: foodData.nutrients?.saturatedFat ?? 0,
            carbs: foodData.nutrients?.carbs ?? 0,
            sugars: foodData.nutrients?.sugars ?? 0,
            protein: foodData.nutrients?.protein ?? 0,
          },
          ingredients: foodData.ingredients || "No ingredients listed",
        };
      });
      console.log("Raw Firestore Data:", fetchedFoods);

      callback(fetchedFoods);
    },
    (error) => {
      console.error("Problem getting saved food", error);
    }
  );

  return unsubscribe;
}

// Not really anything to update here.. 
// UPDATE
export async function updateFoodOrder(foodItems: FoodType[]) {}

// DELETE
export async function deleteFoodItem(itemToDelete: FoodType) {
  try {
    // Delete the image from Firebase Storage
    if (itemToDelete.imageUri) {
      const imageRef = ref(storage, itemToDelete.imageUri);
      try {
        await deleteObject(imageRef);
        console.log("Image deleted successfully");
      } catch (error: any) {
        if (error.code === "storage/object-not-found") {
          console.warn("Image not found, proceeding with deletion of the document");
        } else {
          throw error;
        }
      }
    } else {
      console.error("image not deleted");
      
    }

    // Ensure itemToDelete.id is defined
    if (!itemToDelete.id) {
      throw new Error("Item ID is not defined");
    }

    // Delete the document from Firestore
    const docRef = doc(firestore, "foodList", itemToDelete.id);
    await deleteDoc(docRef);
    console.log("Food item deleted successfully");
  } catch (error) {
    console.error("Error deleting food item: ", error);
  }
}
