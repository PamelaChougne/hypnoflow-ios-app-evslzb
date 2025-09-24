
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
  
  const translateX = useRef(new Animated.Value(-100)).current;
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
    
    const moveAnimation = () => {
      // Animation synchronisée avec l'audio (2 secondes par cycle complet)
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 100,
            duration: 500, // 1 seconde pour aller à droite
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
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
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -100,
            duration: 500, // 1 seconde pour aller à gauche
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
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
          moveAnimation();
        }
      });
    };

    moveAnimation();
  };

  const stopAnimation = () => {
    console.log('Stopping bilateral animation');
    Animated.timing(translateX, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
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

      // Tentative de chargement du fichier audio local
      try {
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
      } catch (audioError) {
        console.log('Audio file not found, showing instructions:', audioError);
        Alert.alert(
          'Fichier audio manquant',
          'Le fichier audio de stimulation bilatérale doit être placé dans assets/audio/stimulation_bilaterale.mp3\n\nTéléchargez le fichier depuis https://we.tl/t-Q3U9kVrp6A et placez-le dans le dossier assets/audio/',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.log('Error setting up audio:', error);
      Alert.alert('Erreur', 'Impossible de configurer l\'audio');
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
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            Stimulation Bilatérale
          </Text>
          <Text style={[commonStyles.text, { marginBottom: 40, color: colors.softSecondary }]}>
            Mouvement rythmé avec audio stéréo - 1 minute
          </Text>

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
                  Suivez la boule lumineuse des yeux.
                </Text>
              </View>
              
              <View style={commonStyles.instructionItem}>
                <Text style={commonStyles.instructionNumber}>3.</Text>
                <Text style={commonStyles.instructionText}>
                  Laissez-vous porter par le mouvement rythmé.
                </Text>
              </View>
              
              <View style={commonStyles.instructionItem}>
                <Text style={commonStyles.instructionNumber}>4.</Text>
                <Text style={commonStyles.instructionText}>
                  Tapotez en rythme !
                </Text>
              </View>
            </View>
          )}

          {/* Zone de stimulation avec boule lumineuse synchronisée */}
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
                  transform: [
                    { translateX: translateX },
                    { scale: scaleAnim }
                  ],
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

          {/* Boutons de contrôle */}
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

            {showInstructions && (
              <TouchableOpacity
                style={[buttonStyles.secondary, { width: '100%' }]}
                onPress={() => setShowInstructions(false)}
              >
                <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 0, color: colors.accent }]}>
                  Masquer les instructions
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
