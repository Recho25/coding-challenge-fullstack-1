import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import useFetchSuggestions from "../hooks/textures/useFetchSuggestions";
import {Texture} from "../types/textures/Texture";
import {AutocompleteProps} from "../types/textures/suggestions/AutocompleteProps";
import useKeyboardEvents from "../hooks/events/keyboard/useKeyboardEvents";


const Autocomplete = ({onSuggestionSelected}: AutocompleteProps) => {
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
      return <Text style={styles.suggestionText}>Loading...</Text>;
    }

    if (error) {
      return <Text style={styles.suggestionText}>Error: {error.message}</Text>;
    }

    if (suggestions.length === 0) {
      return <Text style={styles.suggestionText}>No suggestions found</Text>;
    }

    return suggestions.map((suggestion: Texture, index: number) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.suggestion,
          selectedIndex === index ? styles.selectedSuggestion : {},
        ]}
        onPress={() => handleSelect(suggestion)}
      >
        <Image
          source={{ uri: suggestion.thumbnail_url }}
          style={styles.thumbnail}
        />
        <View>
          <Text style={styles.name}>{suggestion.name}</Text>
          <Text style={styles.description}>
            {suggestion.description.substring(0, 100)}...
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };


  return (
    <View style={styles.autocomplete}>
      <TextInput
        ref={searchInputRef}
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search textures..."
      />
      { showSuggestions &&
      <React.Fragment>
        <ScrollView style={styles.suggestions} testID={"suggestions"}>
          {renderSuggestions()}
        </ScrollView>
      </React.Fragment>
      }
    </View>
  );
};

export default Autocomplete;


const styles = StyleSheet.create({
  autocomplete: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectedSuggestion: {
    backgroundColor: '#E0E0E0',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 14,
    fontSize: 16,
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
    fontSize: 18,
  },
  description: {
    fontSize: 14,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});


