import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ProductDetails() {
  const { product } = useLocalSearchParams();
  const productString = Array.isArray(product) ? product[0] : product;
  const productData = productString ? JSON.parse(productString) : null;

  if (!productData) {
    return (
      <View style={styles.container}>
        <Text>No product details available. Please scan a barcode.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: productData.image_url }} style={styles.image} />
      <Text style={styles.name}>{productData.product_name}</Text>

      <Text style={styles.title}>Næringsindhold:</Text>
      <Text>Energi: {productData.nutriments.energy} kcal</Text>
      <Text>Fedt: {productData.nutriments.fat}g</Text>
      <Text>Mættet Fedt: {productData.nutriments["saturated-fat"]}g</Text>
      <Text>Kulhydrater: {productData.nutriments.carbohydrates}g</Text>
      <Text>Heraf Sukker: {productData.nutriments.sugars}g</Text>
      <Text>Protein: {productData.nutriments.proteins}g</Text>
      <Text>OBS: Tallene kan være forkerte/forældede</Text>

      {/* Ingredients */}
      <Text style={styles.title}>Ingredienser:</Text>
      {productData.ingredients_text ? <Text>{productData.ingredients_text}</Text> : <Text>Ingredienser er ikke tilgængelige for denne madvare.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#407088",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 20
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  }
});
