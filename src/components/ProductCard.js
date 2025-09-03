import { StyleSheet, Text, View } from "react-native";

export default function ProductCard({ product, reason }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{product.product_name}</Text>
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      {reason && <Text style={styles.reason}>💡 {reason}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#222" },
  brand: { fontSize: 14, color: "#007AFF", marginTop: 2 },
  category: { fontSize: 14, color: "#666", marginTop: 2 },
  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#28A745",
  },
  reason: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
  },
});
