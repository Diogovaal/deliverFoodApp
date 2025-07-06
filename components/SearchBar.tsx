import { images } from '@/constants'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'


const SearchBar = () => {
    const params:{query?:string|undefined}= useLocalSearchParams<{query?: string}>()
    const [query, setQuery] = useState(params.query)

 

    const handleSearch:(text:string) => void = (text:string) =>{
        setQuery(text)
       
        if(!text)router.setParams({query: undefined})
    }

    const handleSubmit:()=>void = ()=> {
        if(!query?.trim()) router.setParams({query})
    }



  return (
    <View>
      <TextInput
      className='flex-1 p-5'
      placeholder='Pesquise por pizzas, hamburgers...'
      value={query}
      onChangeText={handleSearch}
      onSubmitEditing={handleSubmit}
      placeholderTextColor='#a0a0a0'
      returnKeyType='search'
      />
      <TouchableOpacity className='pr-5' 
      onPress={()=> router.setParams({query})}>
        <Image 
        source={images.search}
        className='size-6'
        resizeMode='contain'
        tintColor='#5d5df6d'
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar