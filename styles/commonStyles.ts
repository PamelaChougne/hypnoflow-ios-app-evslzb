
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Couleurs HypnoFlow
  background: '#0B0314',      // Fond sombre : bleu nuit
  accent: '#42E1E3',          // Accent : turquoise
  secondAccent: '#8A2BE2',    // Second accent : violet
  interactive: '#4C9BE8',     // Interactif : bleu
  softSecondary: '#F6AFCF',   // Douce touche secondaire : rose clair
  text: '#FFFFFF',            // Texte en blanc pur
  
  // Couleurs supplémentaires pour l'interface
  card: '#1A0B2E',           // Cartes légèrement plus claires
  border: '#42E1E3',         // Bordures turquoise
  success: '#42E1E3',        // Succès
  warning: '#F6AFCF',        // Avertissement
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.interactive,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    boxShadow: '0px 4px 12px rgba(76, 155, 232, 0.3)',
    elevation: 4,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    boxShadow: '0px 4px 12px rgba(66, 225, 227, 0.3)',
    elevation: 4,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.accent,
    marginBottom: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  textLarge: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    boxShadow: '0px 8px 24px rgba(66, 225, 227, 0.1)',
    elevation: 4,
  },
  breathingCard: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 25,
    padding: 32,
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
    boxShadow: '0px 12px 32px rgba(66, 225, 227, 0.2)',
    elevation: 6,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  instructionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    borderColor: colors.softSecondary,
    borderWidth: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  instructionNumber: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 20,
    fontFamily: 'Nunito_700Bold',
  },
  instructionText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Nunito_400Regular',
  },
});
