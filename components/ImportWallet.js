import crypto from 'crypto';
import { ethers } from 'ethers';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { _retrieveData, _storeData } from '../functions/fileFunctions';

const PasswordCreation = (props) => {
    const { setImportWalletDisplay, setPassword } = props
    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const [hash, setHash] = useState(null)
        
    const styles = StyleSheet.create({
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
        }
    })

    const handleConfirm = () => {
        console.log('checking passwords')
        console.log(pass1)
        console.log(pass2)
        if (pass1 == pass2) {
            setHash(crypto.createHash('sha256').update(pass1).digest('hex'))
            setPassword(pass1)
            setImportWalletDisplay('walletImport')
        }

    }

    return (
        <View style={{alignItems:'center'}}>
            <TextInput
                style={styles.textInput}
                placeholder='password'
                onChangeText={newText => {console.log('changing pass1');setPass1(newText)}}
                defaultValue={pass1}
                secureTextEntry={true}
                editable
            />
            <TextInput
                style={styles.textInput}
                placeholder='password confirmation'
                onChangeText={newText => {console.log('changing pass2');setPass2(newText)}}
                defaultValue={pass2}
                secureTextEntry={true}
                editable
            />
            <Button title="Confirm" onPress={() => handleConfirm()} />
        </View>
    )
}

const ImportWallet = (props) => {
    const { setUserExist, handleLogged } = props
    const [display, setDisplay] = useState('passwordCreation')
    const [password, setPassword] = useState(null)
    const [wallet, setWallet] = useState(null)
    const [mnemonic, setMnemonic] = useState('')
    const [showMnemonic, setShowMnemonic] = useState(false)

    const styles = StyleSheet.create({
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
        mnemonicInput: {
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '.7rem',
            width: '100%',
            height: '150px',
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
            maxWidth: '50%',
            textAlign: 'center'
        }
    })

    const handleWalletImport = () => {
        const importedWallet = ethers.Wallet.fromMnemonic(mnemonic)
        console.log("imported wallet")
        console.log(importedWallet)
        setWallet(importedWallet)
        setDisplay("finish")
    }

    const handleFinish = async () => {
        console.log('***handleFinish at Wallet Import***')
        console.log(wallet)
        const encryptedWallet = await wallet.encrypt(password)
        
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
        _storeData('passwordHash', passwordHash)
        _storeData('cryptoWallet', encryptedWallet)
        //_storeData('cryptoWallet', encryptedWallet)
        setUserExist(true)
    }
    

    return (
        <View>
            { display == "finish" &&
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.greeting}>Imported Wallet</Text>
                    <Text style={styles.greeting}>{wallet.address}</Text>
                    <Button title="Finish" onPress={() => handleFinish()}/>
                </View>
            }
            { display == "passwordCreation" && <PasswordCreation setImportWalletDisplay={setDisplay} setPassword={setPassword}/>}
            { display == "walletImport" &&
                <View>
                    <TextInput
                        style={styles.mnemonicInput}
                        multiline={true}
                        placeholder='secret passphrase'
                        onChangeText={newMnemonic => {setMnemonic(newMnemonic)}}
                        defaultValue={mnemonic}
                        editable
                    />
                    <Button title="Confirm" onPress={() => handleWalletImport()}/>
                </View>
            }
            { showMnemonic && <Text style={styles.greeting}>Save this phrase with you life</Text> }
        </View>
    )
}

export default ImportWallet;