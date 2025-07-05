import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp  = () => {
  
  const [isSubmiitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({name:'', email:'', password:''})

  const submit = async () => {
    const{name, email, password} = form;
    if(!form.email || !form.password || !form.name) 
     return Alert.alert('Erro', 'Preencha todos os campos com email e senha validos')

    setSubmitting(true)
    try {
      await createUser({ name,email,password})
     
     router.replace ('/');
    }catch (error: any) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Verifique suas credenciais e tente novamente.')
    }finally {
      setSubmitting(false)
    }

  }

  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
       


        <CustomInput 
        placeholder='Digite o seu nome'
        value={form.name}
        label='Nome'
        onChangeText={(text) => setForm((prev)=> ({...prev, name: text}))}
        />
      <CustomInput 
        placeholder='Digite o seu email'
        value={form.email}
        label='Email'
        onChangeText={(text) => setForm((prev)=> ({...prev, email: text}))}
        keyboardType='email-address'
        />
        <CustomInput 
        placeholder='Digite a sua senha'
        value={form.password}
        label='password'
         onChangeText={(text) => setForm((prev)=> ({...prev, password: text}))}
        secureTextEntry={true}
        />


        <CustomButton
        title='Cadastrar'
        isLoading={isSubmiitting}
        onPress={submit}

        />

      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>
          já tem uma conta? 
        </Text>
        <Link href='/(auth)/sign-up' className='text-primary base-bold'>Entrar</Link>
      </View>

    </View>
  )
}

export default SignUp 