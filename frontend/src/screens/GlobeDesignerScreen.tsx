import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

interface GlobeDesignerScreenProps {
  onBack: () => void;
}

interface Sticker {
  id: string;
  type: string;
  emoji: string;
  x: number;
  y: number;
}

const GlobeDesignerScreen = ({ onBack }: GlobeDesignerScreenProps) => {
  const [globeColor, setGlobeColor] = useState("#C41E3A"); // Red default
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [globeSize, setGlobeSize] = useState(200);
  const [glitterEnabled, setGlitterEnabled] = useState(false);
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState(20);

  const colors = [
    { name: "Red", value: "#C41E3A" },
    { name: "Green", value: "#0F5132" },
    { name: "Gold", value: "#FFD700" },
    { name: "White", value: "#FFFFFF" },
    { name: "Blue", value: "#4A90E2" },
    { name: "Pink", value: "#FF8B94" },
    { name: "Silver", value: "#C0C0C0" },
  ];

  const stickerTypes = [
    { type: "star", emoji: "⭐" },
    { type: "snowflake", emoji: "❄️" },
    { type: "candy", emoji: "🍬" },
    { type: "gingerbread", emoji: "🍪" },
    { type: "santa", emoji: "🎅" },
    { type: "reindeer", emoji: "🦌" },
    { type: "gift", emoji: "🎁" },
    { type: "bell", emoji: "🔔" },
  ];

  const addSticker = (type: string, emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      type,
      emoji,
      x: globeSize / 2 - 20, // Center initially
      y: globeSize / 2 - 20,
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const { width } = Dimensions.get("window");
  const globeContainerSize = Math.min(width - 48, globeSize + 40);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Design Your Globe 🎄</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Globe Preview Area */}
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.globeContainer,
            { width: globeContainerSize, height: globeContainerSize },
          ]}
        >
          <View
            style={[
              styles.globe,
              {
                width: globeSize,
                height: globeSize,
                borderRadius: globeSize / 2,
                backgroundColor: globeColor,
                borderColor: globeColor === "#FFFFFF" ? "#FFD700" : "#FFD700",
              },
              glitterEnabled && styles.glitterEffect,
            ]}
          >
            {/* Glitter effect overlay */}
            {glitterEnabled && (
              <View style={styles.glitterOverlay}>
                <Text style={styles.glitterText}>✨</Text>
              </View>
            )}

            {/* Text on globe */}
            {text && (
              <Text
                style={[
                  styles.globeText,
                  {
                    fontSize: textSize,
                    color: globeColor === "#FFFFFF" ? "#C41E3A" : "#FFFFFF",
                  },
                ]}
              >
                {text}
              </Text>
            )}

            {/* Stickers */}
            {stickers.map((sticker) => (
              <DraggableSticker
                key={sticker.id}
                sticker={sticker}
                globeSize={globeSize}
                onRemove={() => removeSticker(sticker.id)}
                onMove={(x, y) => {
                  const updated = stickers.map((s) =>
                    s.id === sticker.id ? { ...s, x, y } : s
                  );
                  setStickers(updated);
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Controls Panel */}
      <ScrollView
        style={styles.controlsPanel}
        contentContainerStyle={styles.controlsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Color Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Choose Color</Text>
          <View style={styles.colorPicker}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  globeColor === color.value && styles.colorOptionSelected,
                ]}
                onPress={() => setGlobeColor(color.value)}
              >
                {globeColor === color.value && (
                  <Ionicons name="checkmark" size={20} color="#1a1a2e" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Stickers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Add Stickers</Text>
          <View style={styles.stickerPicker}>
            {stickerTypes.map((sticker) => (
              <TouchableOpacity
                key={sticker.type}
                style={styles.stickerButton}
                onPress={() => addSticker(sticker.type, sticker.emoji)}
              >
                <Text style={styles.stickerEmoji}>{sticker.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {stickers.length > 0 && (
            <TouchableOpacity
              style={styles.clearStickersButton}
              onPress={() => setStickers([])}
            >
              <Text style={styles.clearStickersText}>Clear All Stickers</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✍️ Add Text</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="rgba(232, 213, 183, 0.6)"
            value={text}
            onChangeText={setText}
            maxLength={20}
          />
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Font Size: {textSize}px</Text>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((textSize - 12) / (40 - 12)) * 100}%` },
                ]}
              />
              <View style={styles.sliderButtons}>
                {[12, 16, 20, 24, 28, 32, 36, 40].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sliderButton,
                      textSize === size && styles.sliderButtonActive,
                    ]}
                    onPress={() => setTextSize(size)}
                  >
                    <Text
                      style={[
                        styles.sliderButtonText,
                        textSize === size && styles.sliderButtonTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Globe Size Slider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📏 Globe Size</Text>
          <Text style={styles.sliderLabel}>{globeSize}px</Text>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${((globeSize - 150) / (300 - 150)) * 100}%` },
              ]}
            />
            <View style={styles.sliderButtons}>
              {[150, 175, 200, 225, 250, 275, 300].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sliderButton,
                    globeSize === size && styles.sliderButtonActive,
                  ]}
                  onPress={() => setGlobeSize(size)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      globeSize === size && styles.sliderButtonTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Glitter Effect */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.sectionTitle}>✨ Add Glitter</Text>
            <Switch
              value={glitterEnabled}
              onValueChange={setGlitterEnabled}
              trackColor={{ false: "#767577", true: "#FFD700" }}
              thumbColor={glitterEnabled ? "#FFD700" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              // TODO: Save globe design
              console.log("Save globe:", {
                globeColor,
                stickers,
                globeSize,
                glitterEnabled,
                text,
                textSize,
              });
            }}
          >
            <Text style={styles.saveButtonText}>💾 Save Globe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Draggable Sticker Component
interface DraggableStickerProps {
  sticker: Sticker;
  globeSize: number;
  onRemove: () => void;
  onMove: (x: number, y: number) => void;
}

const DraggableSticker = ({
  sticker,
  globeSize,
  onRemove,
  onMove,
}: DraggableStickerProps) => {
  const pan = useRef(
    new Animated.ValueXY({ x: sticker.x, y: sticker.y })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const x = Math.max(0, Math.min(globeSize - 40, (pan.x as any)._value));
        const y = Math.max(0, Math.min(globeSize - 40, (pan.y as any)._value));
        onMove(x, y);
        pan.setValue({ x, y });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.draggableSticker,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onLongPress={onRemove}
        style={styles.stickerTouchable}
        activeOpacity={0.8}
      >
        <Text style={styles.stickerEmojiLarge}>{sticker.emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GlobeDesignerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.3)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  placeholder: {
    width: 40,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(196, 30, 58, 0.1)",
  },
  globeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  globe: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    overflow: "visible",
  },
  glitterEffect: {
    shadowColor: "#FFD700",
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  glitterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 1000,
    overflow: "hidden",
  },
  glitterText: {
    fontSize: 30,
    opacity: 0.3,
    textAlign: "center",
  },
  globeText: {
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 10,
  },
  draggableSticker: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  stickerTouchable: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stickerEmojiLarge: {
    fontSize: 30,
  },
  controlsPanel: {
    maxHeight: 400,
    backgroundColor: "#1a1a2e",
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 215, 0, 0.3)",
  },
  controlsContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  colorOptionSelected: {
    borderColor: "#FFD700",
    transform: [{ scale: 1.1 }],
    shadowColor: "#FFD700",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  stickerPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  stickerButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(196, 30, 58, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.4)",
  },
  stickerEmoji: {
    fontSize: 30,
  },
  clearStickersButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(196, 30, 58, 0.2)",
    borderRadius: 8,
    alignItems: "center",
  },
  clearStickersText: {
    color: "#E8D5B7",
    fontSize: 14,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#E8D5B7",
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 16,
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabel: {
    color: "#E8D5B7",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  sliderTrack: {
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    position: "relative",
    justifyContent: "center",
  },
  sliderFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 20,
    left: 0,
  },
  sliderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  sliderButtonActive: {
    backgroundColor: "#FFD700",
  },
  sliderButtonText: {
    color: "#E8D5B7",
    fontSize: 10,
    fontWeight: "600",
  },
  sliderButtonTextActive: {
    color: "#1a1a2e",
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: {
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: "#0F5132",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#0F5132",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "700",
  },
});
