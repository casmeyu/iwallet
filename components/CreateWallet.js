import crypto from 'crypto';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { _storeData } from '../functions/fileFunctions';

const WalletCreation = (props) => {
    const { password, setUserExist, handleLogged } = props
    const [wallet, setWallet] = useState(null)

    const [showMnemonic, setShowMnemonic] = useState(false)

    const handleWalletCreation = () => {
        const newWallet = ethers.Wallet.createRandom()
        setWallet(newWallet)
    }

    const handleFinish = async () => {
        console.log('***handleFinish***')
        const encryptedWallet = await wallet.encrypt(password)
        console.log('encrypted wallet')
        console.log(encryptedWallet)
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
        _storeData('passwordHash', passwordHash)
        _storeData('cryptoWallet', encryptedWallet)
        setUserExist(true)
        handleLogged(true)
        /*try {
            console.log('json decrypted wallet')
            console.log(password)
            const fromJsonWallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password)
            
            console.log(fromJsonWallet)
        } catch(ex) {
            console.log('wrong json wallet')
            console.log(ex)
        }
        */
    }

    useEffect(() => {
        handleWalletCreation()
    }, [])

    return (
        <View>
            
            { wallet ? <Text>{wallet.address}</Text> : null }

            { showMnemonic ? <Text>{wallet._mnemonic().phrase}</Text> : null }
            { showMnemonic ? <Text>Save this info mf</Text> : null }
            { wallet && !showMnemonic ? <Button title="Show Mnemonic" onPress={() => setShowMnemonic(true)} /> : null }
            { wallet ? <Button title='Continue' onPress={() => handleFinish()} /> : null }
        </View>
    )
    

}


const PasswordCreation = (props) => {
    const { setCreateWalletDisplay, setPassword } = props
    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const [hash, setHash] = useState(null)
        
    const handleConfirm = () => {
        console.log('checking passwords')
        console.log(pass1)
        console.log(pass2)
        if (pass1 == pass2) {
            setHash(crypto.createHash('sha256').update(pass1).digest('hex'))
            setPassword(pass1)
            setCreateWalletDisplay('walletCreation')
        }

    }

    return (
        <View>
            <TextInput
                placeholder='password'
                onChangeText={newText => {console.log('changing pass1');setPass1(newText)}}
                defaultValue={pass1}
                editable
            />
            <TextInput
                placeholder='password confirmation'
                onChangeText={newText => {console.log('changing pass2');setPass2(newText)}}
                defaultValue={pass2}
                editable
            />
            <Button title="Confirm" onPress={() => handleConfirm()} />
        </View>
    )
}

const CreateWallet = (props) => {
    const { handleLogged, setUserExist } = props
    const [display, setDisplay] = useState('passwordCreation')
    const [password, setPassword] = useState(null)
    return (
        <View>
            <Text>Create Wallet</Text>
            { display == 'passwordCreation' ? <PasswordCreation setCreateWalletDisplay={setDisplay} setPassword={setPassword} /> : null }
            { display == 'walletCreation' ? <WalletCreation setCreateWalletDisplay={setDisplay} handleLogged={handleLogged} setUserExist={setUserExist} password={password}/> : null }
        </View>
    )
}

export default CreateWallet;