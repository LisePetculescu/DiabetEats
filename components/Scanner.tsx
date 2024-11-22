import React, { useState, useEffect } from "react";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";

import { Button, StyleSheet, Text, View, Alert } from "react-native";

interface CameraProps {
  onClose: () => void;
  BarCodeSettings?: string[];
}

export default function CameraScanner({ onClose, BarCodeSettings }: CameraProps) {
  // const [facing, setFacing] = useState<CameraType>(CameraType.back);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permissions...</Text>;
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

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Barcode Scanned", `Type: ${type}\nData: ${data}`);
      // Close the camera after a delay
      setTimeout(() => {
        setScanned(false);
        onClose();
      }, 2000);
    }
  };

  //    const toggleCameraFacing = () => {
  //      setFacing((current) => (current === "back" ? "front" : "back"));
  //    };

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} />
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
    width: "100%",
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
});