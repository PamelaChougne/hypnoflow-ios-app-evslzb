
import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  console.log('HomeScreen rendered');

  const navigateToBreathing = () => {
    console.log('Navigating to breathing');
    router.push('/breathing');
  };

  const navigateToBilateral = () => {
    console.log('Navigating to bilateral stimulation');
    router.push('/bilateral');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={commonStyles.content}>
          {/* Logo et titre */}
          <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
            <LinearGradient
              colors={[colors.accent, colors.secondAccent]}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0px 8px 24px rgba(66, 225, 227, 0.3)',
                elevation: 8,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.text,
                }}
              />
            </LinearGradient>
            
            <Text style={commonStyles.title}>HypnoFlow</Text>
            <Text style={[commonStyles.text, { color: colors.accent, fontSize: 14, marginTop: -8 }]}>
              La trousse de secours de Tiphaine Touzeil
            </Text>
          </View>

          {/* Description */}
          <View style={[commonStyles.section, { marginBottom: 40 }]}>
            <Text style={commonStyles.textLarge}>
              Techniques de respiration et stimulation bilatérale pour favoriser le bien-être mental
            </Text>
          </View>

          {/* Boutons de navigation */}
          <View style={[commonStyles.section, { gap: 20 }]}>
            <TouchableOpacity
              style={[buttonStyles.primary, { width: '100%' }]}
              onPress={navigateToBreathing}
            >
              <View style={[commonStyles.row, { gap: 12 }]}>
                <Ionicons name="leaf-outline" size={24} color={colors.text} />
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 0 }]}>
                  Respiration
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.accent, { width: '100%' }]}
              onPress={navigateToBilateral}
            >
              <View style={[commonStyles.row, { gap: 12 }]}>
                <Ionicons name="eye-outline" size={24} color={colors.background} />
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 0, color: colors.background }]}>
                  Stimulation bilatérale
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
