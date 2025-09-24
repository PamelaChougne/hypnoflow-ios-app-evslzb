import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

export default function BilateralScreen() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  console.log('BilateralScreen rendered', { isActive, timeLeft, showInstructions });

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading sound');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopStimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isActive]);

  const startAnimation = () => {
    console.log('Starting bilateral animation');
    
    const blinkAnimation = () => {
      // Boule centrée qui clignote parfaitement synchronisée avec l'audio (1000ms par cycle)
      Animated.sequence([
        // Phase lumineuse (500ms)
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Phase sombre (500ms)
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (isActive) {
          blinkAnimation();
        }
      });
    };

    blinkAnimation();
  };

  const stopAnimation = () => {
    console.log('Stopping bilateral animation');
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(glowAnim, {
      toValue: 0.3,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const loadAndPlaySound = async () => {
    try {
      console.log('Loading and playing bilateral sound');
      
      // Configuration audio pour la lecture stéréo
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Chargement du fichier audio optimisé
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/stimulation_bilaterale.mp3'),
        { 
          shouldPlay: true, 
          isLooping: false, // Le fichier dure exactement 1 minute
          volume: 1.0,
        }
      );
      setSound(sound);
      console.log('Audio loaded and playing successfully');
      
    } catch (error) {
      console.log('Error with audio:', error);
      // L'animation visuelle continue même sans audio
      Alert.alert('Info', 'Audio non disponible, la stimulation visuelle continue');
    }
  };

  const startStimulation = async () => {
    console.log('Starting bilateral stimulation');
    setShowInstructions(false);
    setIsActive(true);
    setTimeLeft(60); // Exactement 1 minute
    await loadAndPlaySound();
  };

  const stopStimulation = async () => {
    console.log('Stopping bilateral stimulation');
    setIsActive(false);
    setTimeLeft(60);
  
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const goBack = () => {
    console.log('Going back to home');
    stopStimulation();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TouchableOpacity style={commonStyles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={commonStyles.content}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          {/* ✅ MODIFICATION 1 & 2 : Titre mobile-optimisé + sous-titre sans "1 minute" */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={[commonStyles.title, { marginBottom: 4, fontSize: 24 }]}>
              Stimulation
            </Text>
            <Text style={[commonStyles.title, { marginBottom: 12, fontSize: 24 }]}>
              Bilatérale
            </Text>
            <Text style={[commonStyles.text, { color: colors.softSecondary, textAlign: 'center', lineHeight: 20 }]}>
              Clignotement synchronisé avec audio stéréo
            </Text>
          </View>

          {/* Instructions */}
          {showInstructions && (
            <View style={commonStyles.instructionsContainer}>
              <Text style={[commonStyles.subtitle, { marginBottom: 20, color: colors.accent }]}>
                Instructions :
              </Text>
              
              <View style={commonStyles.instructionItem}>
                <Text style={commonStyles.instructionNumber}>1.</Text>
                <Text style={commonStyles.instructionText}>
                  Utilisez des écouteurs stéréo pour une expérience optimale.
                </Text>
              </View>
              
              <View style={commonStyles.instructionItem}>
                <Text style={commonStyles.instructionNumber}>2.</Text>
                <Text style={commonStyles.instructionText}>
                  Tapotez en rythme !
                </Text>
              </View>
            </View>
          )}

          {/* Zone de stimulation avec boule centrée qui clignote */}
          {!showInstructions && (
            <View style={{
              width: '100%',
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 40,
              position: 'relative',
            }}>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  opacity: glowAnim,
                }}
              >
                <LinearGradient
                  colors={[colors.accent, colors.secondAccent]}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    boxShadow: '0px 8px 24px rgba(66, 225, 227, 0.6)',
                    elevation: 8,
                  }}
                />
              </Animated.View>
            </View>
          )}

          {/* Timer - exactement 1 minute */}
          {isActive && (
            <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
              <Text style={[commonStyles.text, { color: colors.accent, fontSize: 32, fontWeight: '700' }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, color: colors.softSecondary }]}>
                Temps restant
              </Text>
            </View>
          )}

          {/* ✅ MODIFICATION 3 : Bouton unique (suppression "Masquer les instructions") */}
          <View style={[commonStyles.section, { gap: 16 }]}>
            {!isActive ? (
              <TouchableOpacity
                style={[buttonStyles.primary, { width: '100%' }]}
                onPress={startStimulation}
              >
                <View style={[commonStyles.row, { gap: 12 }]}>
                  <Ionicons name="play" size={24} color={colors.text} />
                  <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 0 }]}>
                    Commencer
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[buttonStyles.secondary, { width: '100%' }]}
                onPress={stopStimulation}
              >
                <View style={[commonStyles.row, { gap: 12 }]}>
                  <Ionicons name="stop" size={24} color={colors.accent} />
                  <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 0, color: colors.accent }]}>
                    Arrêter
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
