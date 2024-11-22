import { View, StyleSheet, Pressable, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type IoniconsName = keyof typeof Ionicons.glyphMap;
type MaterialCommunityIconsName = keyof typeof MaterialCommunityIcons.glyphMap;

interface Props {
  label: string;
  theme: "primary" | "secondary";
  onPress: () => void;
  iconName?: IoniconsName | MaterialCommunityIconsName | string;
  iconSet?: "Ionicons" | "MaterialCommunityIcons";
}

export default function Button({ label, theme, onPress, iconName, iconSet = "Ionicons" }: Props) {
  const IconComponent = iconSet === "Ionicons" ? Ionicons : MaterialCommunityIcons;

  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffcbcb", borderRadius: 18 }]}>
        <Pressable style={[styles.button, { backgroundColor: "#132743" }]} onPress={onPress}>
         

          {/* {iconName && <MaterialCommunityIcons name={iconName} size={24} color="#ffcbcb" style={styles.buttonIcon} />} */}
          {/* {iconName && <MaterialCommunityIcons name="barcode-scan" size={24} color="#ffcbcb" style={styles.buttonIcon} />} */}
          {iconName && <IconComponent name={iconName as any} size={24} color="#ffcbcb" style={styles.buttonIcon} />}

      
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
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  buttonIcon: {
    paddingRight: 8,
  },
});
