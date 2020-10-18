import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import api from '../services/api';

interface OrphanageDetailsRouteParams {
  position: {
    latitude: number,
    longitude: number
  }
}

export default function OrphanageData() {

  const route = useRoute()
  const navigate = useNavigation()

  const params = route.params as OrphanageDetailsRouteParams
  const { position } = params

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpen_hours] = useState('')
  const [open_on_weekends, setOpen_on_weekends] = useState(true)
  const [previewImages, setPreviewImages] = useState<String[]>([])

  const handleSelectImages = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    if (status !== 'granted') {
      alert('Necessario acesso a galeria')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })

    if (result.cancelled) return

    const { uri } = result

    setPreviewImages([...previewImages, uri])
  }

  const handleCreateOrphanage = () => {
    console.log({
      latitude: position.latitude,
      longitude: position.longitude,
      name,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    })
    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    data.append('latitude', String(position.latitude))
    data.append('longitude', String(position.longitude))

    // enviando apesnas uma imagen por vez
    previewImages.forEach((image, i) => {
      data.append('images', {
        name: `image_${i}.jpg`, 
        type: 'image/jpg',
        uri: image,
      } as any)
    })

    api.post('orphanages', data).then(res => {
      res.data
      navigate.navigate('OrphanagesMap')
    }).catch(err => console.log(err))
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={e => setName(e)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={e => setAbout(e)}
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.uploadImagesContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {
            previewImages.map(image => {
              return (
                <Image
                  key={String(image)}
                  source={{ uri: String(image) }}
                  style={styles.uploadImage}
                />
              )
            })
          }
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={e => setInstructions(e)}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={e => setOpen_hours(e)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={e => setOpen_on_weekends(e)}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  uploadImagesContainer: {
    flexDirection: 'row',
  },

  uploadImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8
  },

  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontSize: 16,
    color: '#FFF',
  }
})