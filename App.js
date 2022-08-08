import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View} from 'react-native';
import { _retrieveData, _removeData, _storeData } from './functions/fileFunctions';
import Home from './pages/Home';
import NewUser from './components/NewUser';
import Login from './components/Login';



export default function App() {
  const [userExist, setUserExist] = useState(false);
  const [logged, setLogged] = useState(false);
  
  const [currentWallet, setCurrentWallet] = useState(null);

  const deleteWallets = async () => {
    console.log('removing wallets')
    let deleted = false
    try {
      await _removeData('passwordHash')
      await _removeData('cryptoWallet')
    } catch(ex) {
      console.log(ex)
    }
    if (deleted) {
      console.log('removed credentials')
      setUserExist(false)
      setLogged(false)
      return (true)
    }
    console.log('error removing credentials')
    return (false)
  }

  const autoLogoff = () => {
    setTimeout(() => {
      console.log('loggin off...?')
      console.log(logged)
      if (logged) {
        console.log('loggin off')
        setCurrentWallet(null)
        setLogged(false)
      }
    }, 5 * 1000)
  }

  const handleLogged = async (value) => {
    setLogged(value)
    console.log('loggin in setting 30 secs')
    setTimeout(() => {
      console.log('loggin off...?')
      if (value) {
        console.log('loggin off')
        setCurrentWallet(null)
        setLogged(false)
      }
    }, 3 * 60 * 1000)
  }

  useEffect(async () => {
    await _retrieveData('passwordHash') ? setUserExist(true) : setUserExist(false)
  }, [])

  return (
    <View style={styles.container}>
      { userExist && !logged ? <Login handleLogged={handleLogged} setCurrentWallet={setCurrentWallet} /> : null}
      { !userExist ? <NewUser handleLogged={handleLogged} setUserExist={setUserExist} setCurrentWallet={setCurrentWallet} /> : null }
      { logged ? <Home currentWallet={currentWallet} setCurrentWallet={setCurrentWallet} handleLogged={handleLogged} deleteWallets={deleteWallets} /> : null }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2d42',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
