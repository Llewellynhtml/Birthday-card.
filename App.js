import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  withSpring,
  Animated,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";

import img1 from "./assets/Birthday Card .png";
import img2 from "./assets/Birthday Queen.png";
import img3 from "./assets/Happy and Joyful Birthday - Vintage Lettering.png";
import img4 from "./assets/Happy Birthday Card.png";
import img5 from "./assets/Wishing You A Happy Birthday - Cake.png";

const templates = [img1, img2, img3, img4, img5];

const App = () => {
  const [cardText, setCardText] = useState("Happy Birthday!");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("black");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [selectedFontStyle, setSelectedFontStyle] = useState("Roboto");
  const [imageUri, setImageUri] = useState(null);
  const [decoration, setDecoration] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
    requestPermission();
  }, []);

  const handleTextChange = (text) => setCardText(text);
  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const increaseFontSize = () => setFontSize(fontSize + 2);
  const decreaseFontSize = () => setFontSize(fontSize - 2);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const addDecoration = (decorationType) => setDecoration(decorationType);

  const onPanGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    setImagePosition({ x: translationX, y: translationY });
  };

  const onPinchGestureEvent = (event) => {
    const { scale } = event.nativeEvent;
    setScale(scale);
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(imagePosition.x) },
      { translateY: withSpring(imagePosition.y) },
      { scale: withSpring(scale) },
    ],
  }));

  const renderImage = () => {
    if (!imageUri) return null;

    return (
      <PanGestureHandler onGestureEvent={onPanGestureEvent}>
        <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
        </PinchGestureHandler>
      </PanGestureHandler>
    );
  };

  const handleTemplateSelect = (index) => setSelectedTemplateIndex(index);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Create Your Custom Birthday Card</Text>

      <View style={styles.previewContainer}>
        <Text style={styles.previewHeader}>Preview</Text>
        <View style={styles.cardPreview}>
          <Image
            source={templates[selectedTemplateIndex]}
            style={styles.cardImage}
          />
          <Text
            style={{
              fontSize: fontSize,
              fontWeight: isBold ? "bold" : "normal",
              fontStyle: isItalic ? "italic" : "normal",
              color: fontColor,
              fontFamily: selectedFontStyle,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -100 }, { translateY: -50 }],
            }}
          >
            {cardText}
          </Text>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}
          {decoration === "heart" && (
            <Text style={styles.heartDecorationInPreview}>❤️</Text>
          )}
        </View>
      </View>

      {/* Templates Section */}
      <View style={styles.templatesContainer}>
        <Text style={styles.templatesHeader}>Select a Template</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {templates.map((template, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTemplateSelect(index)}
            >
              <Image source={template} style={styles.templateThumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={[
          styles.textInput,
          {
            fontSize: fontSize,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            color: fontColor,
            fontFamily: selectedFontStyle,
          },
        ]}
        value={cardText}
        onChangeText={handleTextChange}
        placeholder="Type your message here"
        multiline
      />

      <View style={styles.controls}>
        <Picker
          selectedValue={fontSize}
          style={styles.picker}
          onValueChange={(itemValue) => setFontSize(itemValue)}
        >
          {[18, 20, 22, 24, 26, 28, 30].map((size) => (
            <Picker.Item label={`Font Size: ${size}`} value={size} key={size} />
          ))}
        </Picker>

        <Picker
          selectedValue={isBold}
          style={styles.picker}
          onValueChange={(itemValue) => setIsBold(itemValue)}
        >
          <Picker.Item label="Bold" value={true} />
          <Picker.Item label="Normal" value={false} />
        </Picker>

        <Picker
          selectedValue={isItalic}
          style={styles.picker}
          onValueChange={(itemValue) => setIsItalic(itemValue)}
        >
          <Picker.Item label="Italic" value={true} />
          <Picker.Item label="Normal" value={false} />
        </Picker>

        <Picker
          selectedValue={fontColor}
          style={styles.picker}
          onValueChange={(itemValue) => setFontColor(itemValue)}
        >
          <Picker.Item label="Red Font" value="red" />
          <Picker.Item label="Black Font" value="black" />
        </Picker>
      </View>

      <View style={styles.fontStyleContainer}>
        <Picker
          selectedValue={selectedFontStyle}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedFontStyle(itemValue)}
        >
          <Picker.Item label="Roboto" value="Roboto" />
          <Picker.Item label="Serif" value="serif" />
          <Picker.Item label="Cursive" value="cursive" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => addDecoration("heart")}
      >
        <Text style={styles.buttonText}>Add Heart Decoration</Text>
      </TouchableOpacity>

      {renderImage()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    paddingBottom: 40,
    paddingTop: 40, // Ensures there's space at the top
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  previewHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardPreview: {
    position: "relative",
    marginBottom: 20,
  },
  cardImage: {
    width: 320,
    height: 540,
    marginBottom: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  heartDecorationInPreview: {
    fontSize: 40,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  templatesContainer: {
    marginBottom: 20,
  },
  templatesHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  templateThumbnail: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  textInput: {
    width: "100%",
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  controls: {
    marginBottom: 60,
  },
  fontStyleContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  picker: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
});

export default App;
