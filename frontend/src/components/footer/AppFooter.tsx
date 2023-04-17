import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const AppFooter = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>©
        {new Date().getFullYear()} Reda Choukry
      </Text>
      <TouchableOpacity
        onPress={() => {
          window.open('https://my-portfolio-recho25.vercel.app/', '_blank');
        }}
      >
        <Text style={styles.footerLink}>My Portfolio</Text>
      </TouchableOpacity>
      <Text style={styles.footerSeparator}>|</Text>
      <TouchableOpacity
        onPress={() => {
          window.open('https://github.com/Recho25', '_blank');
        }}
      >
        <Text style={styles.footerLink}>My Github</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppFooter;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#4a69bd',
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#000000',
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  footerLink: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
    paddingHorizontal: 5,
  },
  footerSeparator: {
    color: '#ffffff',
    fontSize: 16,
  },
});
