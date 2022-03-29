import React, { useContext, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';

import { loginStyles } from '../themes/LoginTheme';

import WhiteLogo from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export default function RegisterScreen({ navigation } : Props) {

  const { signUp, errorMessage, removeError } = useContext(AuthContext);
  
  const { name, email, password, onChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if(errorMessage.length === 0) return;
    Alert.alert('Registro Incorrecto', errorMessage,[{
          text: 'Ok',
          onPress: removeError
        }]
    );
  },  [ errorMessage ])

  const onRegister = () => {
    console.log(email, password)
    Keyboard.dismiss();
    signUp({nombre: name, correo: email, password});
  }
  
  return (
    <>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5658D6' }}
        behavior={ (Platform.OS === 'ios' ? 'padding' : 'height')}
      >
      
        <View style= { loginStyles.container }>
          <WhiteLogo />
          <Text style={ loginStyles.title }>Registro</Text>

          <Text style={ loginStyles.label }>Nombre:</Text>
          <TextInput 
            placeholder="Ingrese su Nombre"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[ 
              loginStyles.inputField,
              ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
            ]}
            selectionColor="white"
            autoCapitalize="words"
            autoCorrect={ false }

            onChangeText={ (value) => onChange(value, 'name')}
            value={ name }
            onSubmitEditing={ onRegister }
          />
          <Text style={ loginStyles.label }>Email:</Text>
          <TextInput 
            placeholder="Ingrese su Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[ 
              loginStyles.inputField,
              ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={ false }

            onChangeText={ (value) => onChange(value, 'email')}
            value={ email }
            onSubmitEditing={ onRegister }
          />
          <Text style={ loginStyles.label }>Contaseña:</Text>
          <TextInput 
            placeholder="Ingrese su Contraseña"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            secureTextEntry
            style={[ 
              loginStyles.inputField,
              ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={ false }

            onChangeText={ (value) => onChange(value, 'password')}
            value={ password }
            onSubmitEditing={ onRegister }
          />

          <View style={ loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={ onRegister }
            >
              <Text style={ loginStyles.buttonText }>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>


            <TouchableOpacity
              activeOpacity={0.8}
              onPress={ () => navigation.replace('LoginScreen')}
              style={{
                ...loginStyles.return
              }}
            >
              <Text style={ loginStyles.buttonText }>Login</Text>
            </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>

    </>
  )
}