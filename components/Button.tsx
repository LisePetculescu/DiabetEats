import { View, StyleSheet, Pressable, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffcbcb", borderRadius: 18 }]}>
        <Pressable style={[styles.button, { backgroundColor: "#132743" }]} onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color="#ffcbcb" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: "#ffcbcb" }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert("you pressed a button")}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16
  },
  buttonIcon: {
    paddingRight: 8
  }
});
