import React, { useState, useEffect } from "react";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { useRouter } from "expo-router";

import { Button, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";

interface CameraProps {
  onClose: () => void;
}

export default function CameraScanner({ onClose }: CameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleGrantPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
    } else {
      Alert.alert("Permission Denied", "Camera access is required to scan barcodes. Please enable camera permissions in your device settings.");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to the camera. Please grant permission to use the camera.</Text>
        <Button title="Grant Permission" onPress={handleGrantPermission} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button
          title="Grant Permission"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (scanned) return;
    setLoading(true);
    setScanned(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

    // data = "5410041001204"; // tuc
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}?fields=product_name,nutriscore_data,nutriments,image_url`);
      const result = await response.json();
      setLoading(false);
      if (result.status === 1) {
        // Navigate to the product details page and pass the product data
        router.push({
          pathname: "/ProductDetails",
          params: { product: JSON.stringify(result.product) },
        });
        onClose();
      } else {
        Alert.alert("Product Not Found", "No data available for this barcode.");
        setScanned(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to fetch product details.");
      setScanned(false);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}
      {!loading && <CameraView style={styles.camera} facing="back" onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} />}
      <Button title="Close Camera" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: 200,
    height: 100,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
