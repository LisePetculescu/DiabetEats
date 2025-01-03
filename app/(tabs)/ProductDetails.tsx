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
        <Text style={styles.text}>Her er ingen produktdetaljer. Scan en barcode.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: productData.image_url }} style={styles.image} />
      <Text style={[styles.name, styles.text]}>{productData.product_name}</Text>

      <Text style={[styles.title, styles.text]}>Næringsindhold:</Text>
      <Text style={styles.text}>Energi: {productData.nutriments.energy} kcal</Text>
      <Text style={styles.text}>Fedt: {productData.nutriments.fat}g</Text>
      <Text style={styles.text}>Mættet Fedt: {productData.nutriments["saturated-fat"]}g</Text>
      <Text style={styles.text}>Kulhydrater: {productData.nutriments.carbohydrates}g</Text>
      <Text style={styles.text}>Heraf Sukker: {productData.nutriments.sugars}g</Text>
      <Text style={styles.text}>Protein: {productData.nutriments.proteins}g</Text>
      <Text style={styles.text}>OBS: Tallene kan være forkerte/forældede</Text>

      {/* Ingredients */}
      <Text style={[styles.title, styles.text]}>Ingredienser:</Text>
      {productData.ingredients_text ? <Text style={styles.text}>{productData.ingredients_text}</Text> : <Text style={styles.text}>Ingredienser er ikke tilgængelige for denne madvare.</Text>}
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
    padding: 20,
  },
  image: {
    width: "100%",
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
