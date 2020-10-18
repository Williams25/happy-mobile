import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import mapMarker from '../images/Icon.png'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface orphanageInterface {
  id: number;
  name: string;
  latitude: number,
  longitude: number
}

const OrphanagesMap = () => {
  const navigation = useNavigation()

  const handleNavigateOrphanageDetails = (id: number) => navigation.navigate('OrphanagesDetail', { id })
  const handleNavigateToCreateOrphanage = () => navigation.navigate('SelectMapPosition')

  const [orphanages, setOrphanages] = useState<orphanageInterface[]>([])

  useFocusEffect(() => {
    api.get('orphanages').then(res => {
      setOrphanages(res.data)
    }).catch(err => console.log(err))
  })

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -21.6119002,
          longitude: -48.3647899,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008
        }}
      >
        {
          orphanages.map((orphanage: orphanageInterface) => {
            return (
              <Marker
                key={orphanage.id}
                icon={mapMarker}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
                calloutAnchor={{
                  x: 2.1,
                  y: 0.8
                }}
              >
                <Callout tooltip={true} onPress={() => handleNavigateOrphanageDetails(orphanage.id)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>
                      {orphanage.name}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            )
          })
        }
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
         {orphanages.length} Orfanatos encontrados
      </Text>

        <RectButton style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Ionicons name="ios-add" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  calloutContainer: {
    width: 100,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 2.5
  },
  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    // fontFamily: 'Nunito_700Bold',
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 46,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2.5
  },
  footerText: {
    color: '#8fa7b3',
    fontSize: 14,
    // fontFamily: 'Nunito_700Bold',
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default OrphanagesMap