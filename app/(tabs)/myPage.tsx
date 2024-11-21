import { Text, View, StyleSheet } from "react-native";

export default function myPage() {
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
    alignItems: "center"
  },
  text: {
    color: "#fff"
  }
});
