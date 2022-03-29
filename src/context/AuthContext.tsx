import React, { useEffect, useReducer } from 'react';
import { createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import coffeeAPI from '../api/coffeeAPI';
import { LoginResponse, Usuario, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { AuthReducer, AuthState } from './authReducer';

type AutnContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AutnContextProps);

export const AuthProvider = ({ children}: any ) => {

    const [ state, dispatch ] = useReducer(AuthReducer, authInitialState);

    useEffect(() => {
      checkToken();
    }, [])

    const checkToken = async() => {

        const token = await AsyncStorage.getItem('token');
        if(!token) return dispatch({ type: 'notAuthenticated'});

        const response = await coffeeAPI.get('/auth');
        if( response.status !== 200 ) {
            return dispatch({ type: 'notAuthenticated'});
        }
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ 
            type: 'signUp',
            payload: {
                token: response.data.token,
                user: response.data.usuario
            } 
        });
    }
    

    const signIn = async({ correo, password }: LoginData ) => {
        try {
            const { data } = await coffeeAPI.post<LoginResponse>('/auth/login', { correo, password});
            dispatch({ 
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                } 
            });
            await AsyncStorage.setItem('token', data.token);
        } catch (err: any) {
            console.log(err.response.data.msg);
            dispatch({ 
                type: 'addError',
                payload: err.response.data.msg || 'Información Incorrecta'
            })
        }
    };

    const signUp = async({nombre, correo, password}: RegisterData) => {
        try {
            const { data } = await coffeeAPI.post<LoginResponse>('/usuarios', {nombre, correo, password});
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });
            await AsyncStorage.setItem('token', data.token);
        } catch (err:any) {
            console.log(err.response.data.msg)
            dispatch({ 
                type: 'addError',
                payload: err.response.data.errors[0].msg || 'Revise la información'
            })
        }
    };

    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        dispatch({
            type: 'logout'
        })
    };

    const removeError =() => {
        dispatch({
            type: 'removeError'
        })
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signUp,
                signIn,
                logOut,
                removeError
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}