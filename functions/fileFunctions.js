import AsyncStorage from '@react-native-async-storage/async-storage';

export async function _removeData(key) {
    console.log(`entered to delete ${key}`)
    try {
      await AsyncStorage.removeItem(key)
      console.log('deleted')
      return true
    }
    catch(ex) {
      console.log('not deleted')
      console.log(ex)
      return false;
    }
  }
  
export async function _retrieveData(key) {
    
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        return(value)
      }
    } catch (error) {
      // Error retrieving data
    }
    return (null)
  }
export async function _storeData(key, value) {
    console.log(`saving ${value}`)
    try {
        await AsyncStorage.setItem(key, value);
        const saved = await _retrieveData('passwordHash')
        console.log('saved value')
        console.log(saved)
        return (value);
    } catch (error) {
        // Error saving data
    }
    return (null);
  }

