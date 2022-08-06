import crypto from 'crypto';
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { _retrieveData } from '../functions/fileFunctions';
import Button from './ui/Button'
import { ethers } from 'ethers';
import { TouchableHighlight } from 'react-native-web';

const Login = (props) => {
    const { handleLogged, setCurrentWallet } = props
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    
    const handleLogin = async () => {
        console.log('***handle login***')
        const hash = crypto.createHash('sha256').update(password).digest('hex')

        const hashCheck = await _retrieveData('passwordHash')
        if (hash == hashCheck) {
            setError('logging...')
            console.log('password matched')
            const wallets = await _retrieveData('wallets')
            console.log('wallets at login')
            console.log(wallets)
            
            const cwallet = await _retrieveData('cryptoWallet')
            console.log('got crypto wallet from storage')
            console.log(`current wallet retrieved ${cwallet}`)
            const dwallet = await ethers.Wallet.fromEncryptedJson(cwallet, password)
            console.log(`decrypted wallet ${dwallet}`)
            console.log(dwallet.privateKey)
            setCurrentWallet(dwallet)
            handleLogged(true)
        } else {
            console.log('pasword did not match')
            setError('password did not match')
        }
    }

    return (
      <View style={styles.login}>
        <Text style={styles.greeting}>Welcome to iwallet</Text>
        <TextInput style={styles.textInput}
            placeholder='password'
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            secureTextEntry={true}
            editable
        />
        <Text style={{color:'white'}}>{error}</Text>
        <Button text='Login' f={handleLogin} styles={{button: styles.button, buttonText: styles.buttonText}} />

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

export default Login;