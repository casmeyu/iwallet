import crypto from 'crypto';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { _retrieveData, _storeData } from '../functions/fileFunctions';

const WalletCreation = (props) => {
    const { password, setUserExist, handleLogged } = props
    const [wallet, setWallet] = useState(null)

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
        greeting: {
            margin: '.8rem',
            fontSize: '32px',
            color: 'white',
            maxWidth: '50%',
            textAlign: 'center'
        }
    })

    const handleWalletCreation = () => {
        const newWallet = ethers.Wallet.createRandom()
        setWallet(newWallet)
    }

    const handleFinish = async () => {
        console.log('***handleFinish***')
        const encryptedWallet = await wallet.encrypt(password)
        
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
        _storeData('passwordHash', passwordHash)
        _storeData('cryptoWallet', encryptedWallet)
        //_storeData('cryptoWallet', encryptedWallet)
        setUserExist(true)
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
        <View style={{width:'90%', justifyContent:'center', alignItems:'center'}}>
            
            { wallet ? <Text style={styles.greeting}>{wallet.address}</Text> : null }
            { showMnemonic &&
                <View style={{width:'100%', justifyContent:'center', alignItems:'center', borderColor:"#CCCCCC", borderWidth:'2px', borderRadius:'25px'}}>
                    <Text style={styles.greeting}>{wallet._mnemonic().phrase}</Text>
                </View>
            }
            { showMnemonic && <Text style={styles.greeting}>Save this phrase with you life</Text> }
            
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
            setCreateWalletDisplay('walletCreation')
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

const CreateWallet = (props) => {
    const { handleLogged, setUserExist } = props
    const [display, setDisplay] = useState('passwordCreation')
    const [password, setPassword] = useState(null)
    const styles = StyleSheet.create({
        greeting: {
            margin: '.8rem',
            fontSize: '32px',
            color: 'white',
        }
    })

    return (
        <View style={{alignItems:'center'}}>
            <Text style={styles.greeting}>Create Wallet</Text>
            { display == 'passwordCreation' ? <PasswordCreation setCreateWalletDisplay={setDisplay} setPassword={setPassword} /> : null }
            { display == 'walletCreation' ? <WalletCreation setCreateWalletDisplay={setDisplay} handleLogged={handleLogged} setUserExist={setUserExist} password={password}/> : null }
        </View>
    )


}



export default CreateWallet;