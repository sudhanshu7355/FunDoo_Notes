import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#038062', 
        width: 56,
        height: 56,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
      },
      subFab: {
        position: 'absolute',
        backgroundColor: '#038062',
        borderRadius: 24,
        paddingHorizontal: 20,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        zIndex: 100,
      },
  subButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  
});


