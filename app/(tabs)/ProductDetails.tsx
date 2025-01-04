import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { saveFood } from "@/app/fetch";
import Button from "@/app/components/Button";
import Toast from "react-native-toast-message";

export default function ProductDetails() {
  const { product } = useLocalSearchParams();
  const productString = Array.isArray(product) ? product[0] : product;
  const initialProductData = productString ? JSON.parse(productString) : null;
  const [productData, setProductData] = useState(initialProductData);
  const [showProduct, setShowProduct] = useState(false);

  useEffect(() => {
    if (productString) {
      const newProductData = JSON.parse(productString);
      setProductData(newProductData);
      setShowProduct(true);
    }
  }, [productString]);

  async function addFood() {
    const newFood = {
      name: productData.product_name,
      imageUri: productData.image_url,
      nutrients: {
        energy: productData.nutriments["energy-kcal"],
        fat: productData.nutriments.fat,
        saturatedFat: productData.nutriments["saturated-fat"],
        carbs: productData.nutriments.carbohydrates,
        sugars: productData.nutriments.sugars,
        protein: productData.nutriments.proteins,
      },
      ingredients: productData.ingredients_text,
    };
    try {
      await saveFood(newFood);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Food item saved successfully!",
      });
      setShowProduct(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save food item.",
      });
    }
  }

  function resetView() {
    // Reset state to ensure the product data is cleared.

    // setProductData(null);
    setShowProduct(false);
    console.log("View reset");
  }

  // if (!productData) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.text}>Her er ingen produktdetaljer. Scan en barcode.</Text>
  //     </View>
  //   );
  // }
  if (!showProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Her er ingen produktdetaljer. Scan en barcode.</Text>
      </View>
    );
  }
  const imageUrl = productData.image_url || "https://cdn.creazilla.com/icons/3433516/food-icon-md.png";

  if (showProduct) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          {/* <Button theme="primary" iconName="save" iconSet="Ionicons" label="Gem madvare" onPress={addFood} /> */}
          {/* <Button theme="primary" iconName="nutrition" iconSet="Ionicons" label="Gem madvare" onPress={addFood} /> */}
          <Button theme="primary" iconName="playlist-add" iconSet="MaterialIcons" label="Gem madvare" onPress={addFood} />
          {/* <Button theme="primary" iconName="exit" iconSet="Ionicons" label="" onPress={resetView} /> */}

          <Text style={[styles.name, styles.text]}>{productData.product_name}</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} onError={(error) => console.error("Image loading error:", error.nativeEvent.error)} />
          {/* <Image source={{ uri: productData.image_url || "https://cdn.creazilla.com/icons/3433516/food-icon-md.png" }} style={styles.image} /> */}
          <Text style={[styles.title, styles.text]}>Næringsindhold (pr. 100g):</Text>
          <Text style={styles.text}>Energi: {productData.nutriments["energy-kcal"]} kcal</Text>
          <Text style={styles.text}>Fedt: {productData.nutriments.fat}g</Text>
          <Text style={styles.text}>Mættet Fedt: {productData.nutriments["saturated-fat"]}g</Text>
          <Text style={styles.text}>Kulhydrater: {productData.nutriments.carbohydrates}g</Text>
          <Text style={styles.text}>Heraf Sukker: {productData.nutriments.sugars}g</Text>
          <Text style={styles.text}>Protein: {productData.nutriments.proteins}g</Text>
          <Text style={styles.text}>OBS: Tallene kan være forkerte/forældede</Text>

          {/* Ingredients */}
          <Text style={[styles.title, styles.text]}>Ingredienser:</Text>
          {productData.ingredients_text ? <Text style={styles.text}>{productData.ingredients_text}</Text> : <Text style={styles.text}>Ingredienser er ikke tilgængelige for denne madvare.</Text>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#407088",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 20,
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
  text: {
    color: "#fff",
  },
});
