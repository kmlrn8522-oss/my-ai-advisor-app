import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ProductCard from "./components/ProductCard";
import catalog from "./skus.json";

export default function AdvisorScreen() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const prompt = `
You are an AI shopping assistant.
Here is a product catalog: ${JSON.stringify(catalog)}

User request: "${query}"

From the catalog, recommend the **3 most relevant products**. 
For each product, explain shortly why it matches the request.
Return response as JSON in this format:
[
 { "product_name": "", "brand": "", "price": "", "category": "", "reason": "" }
]
`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      text = text.replace(/```json|```/g, "").trim();
      let parsed = [];
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e, text);
      }
      setRecommendations(parsed);
    } catch (error) {
      console.error("Error:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🤖 AI Product Advisor</Text>
      <Text style={styles.subheading}>
        Tell us what you need and we’ll find the best match for you
      </Text>

      <TextInput
        placeholder="e.g. I need a smart lock for my home under 10k"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loading || !query}
      >
        <Text style={styles.buttonText}>
          {loading ? "Finding..." : "Find Products"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      <ScrollView style={{ marginTop: 20 }}>
        {recommendations.map((rec, index) => (
          <ProductCard key={index} product={rec} reason={rec.reason} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FB" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 6, color: "#222" },
  subheading: { fontSize: 14, color: "#555", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
    minHeight: 60,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
});
