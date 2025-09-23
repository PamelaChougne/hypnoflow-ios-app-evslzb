
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CardiacBreathingScreen() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4.5);
  const [cycles, setCycles] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  
  const INHALE_TIME = 4.5; // 4.5 secondes
  const EXHALE_TIME = 5.5; // 5.5 secondes

  console.log('CardiacBreathingScreen rendered', { isActive, phase, timeLeft, cycles });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          
          if (newTime <= 0) {
            if (phase === 'inhale') {
              setPhase('exhale');
              return EXHALE_TIME;
            } else {
              setPhase('inhale');
              setCycles(c => c + 1);
              return INHALE_TIME;
            }
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
      const targetScale = phase === 'inhale' ? 1.2 : 0.6;
      const targetOpacity = phase === 'inhale' ? 1 : 0.4;
      const duration = phase === 'inhale' ? INHALE_TIME * 1000 : EXHALE_TIME * 1000;

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: targetOpacity,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phase, isActive]);

  const startBreathing = () => {
    console.log('Starting cardiac breathing');
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(INHALE_TIME);
    setCycles(0);
  };

  const stopBreathing = () => {
    console.log('Stopping cardiac breathing');
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(INHALE_TIME);
    
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
    ]).start();
  };

  const goBack = () => {
    console.log('Going back to breathing menu');
    stopBreathing();
    router.back();
  };

  const getPhaseText = () => {
    return phase === 'inhale' ? 'Inspirez' : 'Expirez';
  };

  const getPhaseColor = () => {
    return phase === 'inhale' ? colors.accent : colors.secondAccent;
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TouchableOpacity style={commonStyles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={commonStyles.content}>
        <View style={[commonStyles.centerContent, { flex: 1 }]}>
          <Text style={[commonStyles.title, { marginBottom: 8 }]}>
            Cohérence Cardiaque
          </Text>
          <Text style={[commonStyles.text, { marginBottom: 40, color: colors.softSecondary }]}>
            Inspiration 4,5s • Expiration 5,5s
          </Text>

          {/* Cercle de respiration */}
          <View style={[commonStyles.centerContent, { marginBottom: 40 }]}>
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }}
            >
              <LinearGradient
                colors={[getPhaseColor(), colors.interactive]}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
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
                Suivez le rythme du cercle
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
