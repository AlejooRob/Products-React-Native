import { View, Text } from 'react-native'
import React from 'react'

export default function Background() {
  return (
    <View 
        style={{
            position: 'absolute',
            backgroundColor: '#5856D6',
            top: -350,
            width:1000,
            height: 1200,
            transform: [
                { rotate: '-70deg'}
            ]

        }}
    />
  )
}