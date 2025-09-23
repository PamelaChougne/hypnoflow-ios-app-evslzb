
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BreathingScreen() {
  console.log('BreathingScreen rendered');

  const navigateToCardiac = () => {
    console.log('Navigating to cardiac coherence');
    router.push('/breathing/cardiac');
  };

  const navigateToSquare = () => {
    console.log('Navigating to square breathing');
    router.push('/breathing/square');
  };

  const goBack = () => {
    console.log('Going back to home');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TouchableOpacity style={commonStyles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={commonStyles.content}>
          <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
            <Ionicons name="leaf" size={80} color={colors.accent} style={{ marginBottom: 20 }} />
            <Text style={commonStyles.title}>Techniques de Respiration</Text>
            <Text style={commonStyles.text}>
              Choisissez votre technique de respiration pour retrouver calme et sérénité
            </Text>
          </View>

          <View style={[commonStyles.section, { gap: 24 }]}>
            {/* Cohérence cardiaque */}
            <View style={commonStyles.card}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                Cohérence Cardiaque
              </Text>
              <Text style={[commonStyles.text, { marginBottom: 20 }]}>
                Inspiration 4,5 secondes • Expiration 5,5 secondes
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, marginBottom: 20, color: colors.softSecondary }]}>
                Technique idéale pour réguler le rythme cardiaque et réduire le stress
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, { width: '100%' }]}
                onPress={navigateToCardiac}
              >
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 0 }]}>
                  Commencer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Respiration en carré */}
            <View style={commonStyles.card}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                Respiration en Carré
              </Text>
              <Text style={[commonStyles.text, { marginBottom: 20 }]}>
                4 temps : Inspire • Retiens • Expire • Retiens
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, marginBottom: 20, color: colors.softSecondary }]}>
                Technique structurée pour une relaxation profonde et un meilleur contrôle
              </Text>
              <TouchableOpacity
                style={[buttonStyles.accent, { width: '100%' }]}
                onPress={navigateToSquare}
              >
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 0, color: colors.background }]}>
                  Commencer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
