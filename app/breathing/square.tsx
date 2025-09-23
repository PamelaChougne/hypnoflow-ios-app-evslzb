
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SquareBreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const PHASE_TIME = 4; // 4 secondes pour chaque phase

  console.log('SquareBreathingScreen rendered', { isActive, phase, timeLeft, cycles });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          
          if (newTime <= 0) {
            switch (phase) {
              case 'inhale':
                setPhase('hold1');
                break;
              case 'hold1':
                setPhase('exhale');
                break;
              case 'exhale':
                setPhase('hold2');
                break;
              case 'hold2':
                setPhase('inhale');
                setCycles(c => c + 1);
                break;
            }
            return PHASE_TIME;
          }
          
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase]);

  useEffect(() => {
    if (isActive) {
      let targetScale = 0.6;
      let targetOpacity = 0.4;
      let targetRotation = 0;

      switch (phase) {
        case 'inhale':
          targetScale = 1.2;
          targetOpacity = 1;
          targetRotation = 0;
          break;
        case 'hold1':
          targetScale = 1.2;
          targetOpacity = 1;
          targetRotation = 0.25;
          break;
        case 'exhale':
          targetScale = 0.6;
          targetOpacity = 0.4;
          targetRotation = 0.5;
          break;
        case 'hold2':
          targetScale = 0.6;
          targetOpacity = 0.4;
          targetRotation = 0.75;
          break;
      }

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: PHASE_TIME * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: targetOpacity,
          duration: PHASE_TIME * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: targetRotation,
          duration: PHASE_TIME * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phase, isActive]);

  const startBreathing = () => {
    console.log('Starting square breathing');
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(PHASE_TIME);
    setCycles(0);
  };

  const stopBreathing = () => {
    console.log('Stopping square breathing');
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(PHASE_TIME);
    
    // Reset animations
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goBack = () => {
    console.log('Going back to breathing menu');
    stopBreathing();
    router.back();
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold1': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'hold2': return 'Retenez';
      default: return 'Inspirez';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return colors.accent;
      case 'hold1': return colors.interactive;
      case 'exhale': return colors.secondAccent;
      case 'hold2': return colors.softSecondary;
      default: return colors.accent;
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={commonStyles.container}>
      <TouchableOpacity style={commonStyles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={commonStyles.content}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            Respiration en Carré
          </Text>
          <Text style={[commonStyles.text, { marginBottom: 40, color: colors.softSecondary }]}>
            4 temps de 4 secondes chacun
          </Text>

          {/* Carré de respiration */}
          <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
            <Animated.View
              style={{
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotation }
                ],
                opacity: opacityAnim,
              }}
            >
              <LinearGradient
                colors={[getPhaseColor(), colors.interactive]}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0px 12px 32px ${getPhaseColor()}40`,
                  elevation: 8,
                }}
              >
                <Text style={[commonStyles.subtitle, { color: colors.text, fontSize: 20 }]}>
                  {getPhaseText()}
                </Text>
                <Text style={[commonStyles.text, { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 0 }]}>
                  {Math.ceil(timeLeft)}
                </Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Informations */}
          {isActive && (
            <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
              <Text style={[commonStyles.text, { color: colors.accent, fontSize: 18 }]}>
                Cycle {cycles + 1}
              </Text>
              <Text style={[commonStyles.text, { fontSize: 14, color: colors.softSecondary }]}>
                Suivez le rythme du carré
              </Text>
            </View>
          )}

          {/* Boutons de contrôle */}
          <View style={[commonStyles.section, { gap: 16 }]}>
            {!isActive ? (
              <TouchableOpacity
                style={[buttonStyles.primary, { width: '100%' }]}
                onPress={startBreathing}
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
                onPress={stopBreathing}
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
