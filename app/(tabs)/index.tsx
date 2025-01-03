import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import Button from "@/components/Button";
import CameraScanner from "@/components/Scanner";

export default function Index() {
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  function useCamera() {
    console.log("useCamera called");
    setIsCameraVisible(true);
  }

  function closeCamera() {
    console.log("closeCamera called");
    setIsCameraVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Velkommen til DiabetEats</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infotext}>Denne app har til formål at du som bruger kan tage et billede af stregkoden på en madvare.</Text>
        <Text style={styles.infotext}>Så du kan se denne madvares næringsindhold.</Text>
        <Text style={styles.infotext}>Det er også muligt at gemme madvarer i favoritter så du nemt kan tjekke dem igen.</Text>
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" iconName="barcode-scan" iconSet="MaterialCommunityIcons" label="Scan madvare" onPress={useCamera} />
      </View>
      {isCameraVisible && <CameraScanner onClose={closeCamera} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#25292e",
    backgroundColor: "#407088",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#fff"
  },
  textHeader: {
    flex: 1 / 4,
    fontSize: 24,
    color: "#ffb5b5"
  },
  infotext: {
    fontSize: 18,
    color: "#fff",
    paddingVertical: 10
  },
  infoContainer: {
    flex: 2 / 4,
    paddingHorizontal: 30
  },
  footerContainer: {
    flex: 1 / 6,
    alignItems: "center"
  }
});
