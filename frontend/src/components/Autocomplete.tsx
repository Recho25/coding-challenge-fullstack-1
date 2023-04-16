import React, {useEffect, useRef, useState} from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import useFetchSuggestions from "../hooks/textures/useFetchSuggestions";
import {Texture} from "../types/textures/Texture";
import {AutocompleteProps} from "../types/textures/suggestions/AutocompleteProps";
import useKeyboardEvents from "../hooks/events/keyboard/useKeyboardEvents";


const Autocomplete = ({onSuggestionSelected}: AutocompleteProps) => {
  const windowWidth = useWindowDimensions().width;
  const dynamicStyles = createDynamicStyles(windowWidth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const shouldFetch = searchTerm.length >= 2;
  const {data: suggestions, error, loading} = useFetchSuggestions({searchTerm, shouldFetch});


  useEffect(() => {
    setShowSuggestions(shouldFetch);
  }, [shouldFetch]);


  const handleSelect = (selectedSuggestion: Texture) => {
    setSearchTerm("");
    setShowSuggestions(false);
    onSuggestionSelected(selectedSuggestion);
  };

  useKeyboardEvents(searchInputRef, (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex > -1 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    }
  });


  const renderSuggestions = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }

    if (error) {
      return <Text>Error: {error.message}</Text>;
    }

    if (suggestions.length === 0) {
      return <Text>No suggestions found</Text>;
    }

    return suggestions.map((suggestion: Texture, index: number) => (
      <TouchableOpacity
        key={index}
        style={[
          dynamicStyles.suggestion,
          selectedIndex === index ? dynamicStyles.selectedSuggestion : {},
        ]}
        onPress={() => handleSelect(suggestion)}
      >
        <Image
          source={{ uri: suggestion.thumbnail_url }}
          style={dynamicStyles.thumbnail}
        />
        <View>
          <Text style={dynamicStyles.name}>{suggestion.name}</Text>
          <Text style={dynamicStyles.description}>
            {suggestion.description.substring(0, 100)}...
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };


  return (
    <View style={dynamicStyles.autocomplete}>
      <TextInput
        ref={searchInputRef}
        style={dynamicStyles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search textures..."
      />
      { showSuggestions &&
      <React.Fragment>
        <ScrollView style={dynamicStyles.suggestions} testID={"suggestions"}>
          {renderSuggestions()}
        </ScrollView>
      </React.Fragment>
      }
    </View>
  );
};

export default Autocomplete;


const createDynamicStyles = (windowWidth: number) => {
  return StyleSheet.create({
    autocomplete: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    selectedSuggestion: {
      backgroundColor: '#E0E0E0',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      paddingHorizontal: windowWidth > 768 ? 20 : 16,
      paddingVertical: windowWidth > 768 ? 14 : 12,
      fontSize: windowWidth > 768 ? 18 : 16,
      backgroundColor: '#FFFFFF',
      marginBottom: 8,
      color: '#333',
    },
    suggestions: {
      width: '100%',
      marginTop: 10,
    },
    suggestion: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    thumbnail: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    name: {
      fontWeight: 'bold',
      fontSize: windowWidth > 768 ? 18 : 16,
    },
    description: {
      fontSize: windowWidth > 768 ? 14 : 12,
    },
  });
};

