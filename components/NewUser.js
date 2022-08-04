import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import CreateWallet from './CreateWallet';
import ImportWallet from './ImportWallet';


const NewUser = (props) => {
    const { setUserExist, handleLogged } = props
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
      <View>
        { !display ? <Text>Welcome to iwallet stranger</Text> : null }
        { !display ? <Button title="Create Wallet" onPress={() => handleCreateWallet()} /> : null}
        { !display ? <Button title="Import Wallet" onPress={() => handleImportWallet()} /> : null}
        { display == "createWallet" ? <CreateWallet setUserExist={setUserExist} handleLogged={handleLogged} /> : null }
        { display == "importWallet" ? <ImportWallet setUserExist={setUserExist} handleLogged={handleLogged} /> : null }
      </View>
    );
}

export default NewUser;