import { View, Text, Image } from 'react-native'
import React from 'react'

export default function WhiteLogo() {
  return (
    <View style={{
        alignItems: 'center'
    }}>
        <Image 
            source={ require('../assets/react-logo-white.png') }
            style={{
                width:110,
                height: 100
            }}
        />
      
    </View>
  )
}