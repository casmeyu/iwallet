import { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import CreateWallet from './CreateWallet';
import ImportWallet from './ImportWallet';


const NewUser = (props) => {
    const { setUserExist, handleLogged, setCurrentWallet } = props
    const [display, setDisplay] = useState(null)

    const handleCreateWallet = () => {
        console.log('setting that user exists')
        setDisplay('createWallet')
    }

    const handleImportWallet = () => {
        console.log('setting that user exists')
        setDisplay('importWallet')
    }

    return (
      <View style={{width:'90%', justifyContent:'center', alignItems:'center'}}>
        { !display ? <Text style={styles.greeting}>Welcome to iwallet stranger</Text> : null }
        { !display ? <Button title="Create Wallet" onPress={() => handleCreateWallet()} /> : null}
        { !display ? <Button title="Import Wallet" onPress={() => handleImportWallet()} /> : null}
        { display == "createWallet" ? <CreateWallet setUserExist={setUserExist} handleLogged={handleLogged} setCurrentWallet={setCurrentWallet}/> : null }
        { display == "importWallet" ? <ImportWallet setUserExist={setUserExist} handleLogged={handleLogged} setCurrentWallet={setCurrentWallet}/> : null }
      </View>
    );
}

const styles = StyleSheet.create({
  login: {
      width: '80%',
      height: '60%',
      alignItems: 'center',
      justifyContent: 'center'
  },
  textInput: {
      textAlign: 'center',
      margin: '1rem',
      padding: '.7rem',
      width: '60%',
      backgroundColor: '#FFFFFF',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: '#CCCCCC',
      borderRadius: '50px',
      fontSize: 'large'
  },
  greeting: {
      margin: '.8rem',
      fontSize: '32px',
      color: 'white',
      textAlign: 'center'
  },
  button: {
      width: '30%',
      height: '3rem',
      margin: '1rem',
      padding: '.3rem',
      textAlign: 'center',
      backgroundColor: '#4895ef',
      borderRadius: '10px',
      justifyContent:'center'
  },
  buttonText: {
      fontSize: 'larger',
      fontWeight: '400'
  }
})

export default NewUser;