import crypto from 'crypto';
import { _retrieveData } from '../functions/fileFunctions';
import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, ScrollView, View, Text, Button, Alert } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { formatEther, formatUnits, hexlify, parseEther, parseUnits } from "ethers/lib/utils";
import { TextInput } from "react-native-web";

const Tab = createMaterialTopTabNavigator();


const ExportPK = (props) => {
    const { connectedWallet, setHomeDisplay } = props

    console.log("***ExportPK***")
    const [showPk, setShowPk] = useState(false)
    const [pass, setPass] = useState('')

    const styles = StyleSheet.create({
        textInput: {
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom:'1rem',
            padding: '.7rem',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: '#CCCCCC',
            borderRadius: '50px',
            fontSize: 'large'
        }
        })

    const handlePassCheck = async () => {
        const hash = crypto.createHash('sha256').update(pass).digest('hex')

        const hashCheck = await _retrieveData('passwordHash')
        if (hash == hashCheck) {
            console.log('password matched')
            setShowPk(true)
        }
    }

    return (
        <View style={{padding:'2rem', justifyContent:'center', width:'100%', alignItems:'center'}}>
            <Text style={{fontSize:'1.5rem', marginTop:'1rem', marginBottom:'.5rem'}}>export private key</Text>
            {showPk ? 
            <View style={{width:'90%'}}>
                <Text style={{marginBottom:'1rem', fontSize:'1.3rem', fontWeight:'450', textAlign:'center'}}>{connectedWallet.privateKey}</Text>
                <Button title="finish" onPress={()=> {setShowPk(false); setHomeDisplay('transactions')}} />
            </View> :
            <View>
                <TextInput 
                    placeholder="password"
                    onChangeText={newTxt => setPass(newTxt)}
                    defaultValue={pass}
                    style={styles.textInput}
                    secureTextEntry={true}
                />
                <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                    <Button title="cancel" onPress={() => setHomeDisplay('transactions') } />
                    <Button title="confirm" onPress={() => handlePassCheck() } />
                </View>
                
            </View>
        }
            
        </View>
    )
}


const NewTransaction = (props) => {
    const { connectedWallet, setTransactionDisplay, provider } = props
    const [tx, setTx] = useState({
        from: connectedWallet.address,
        to: "",
        value: "",
        gasLimit: "",
        gasPrice: ""
    })

    const handleNewTransaction = async (newTx) => {
        console.log("***handleNewTransaction()***")
        try {
            newTx.gasLimit = parseUnits(newTx.gasLimit, "wei")
            newTx.gasPrice = parseUnits(newTx.gasPrice, "wei")
            newTx.value = parseEther(newTx.value)
            newTx.nonce = await connectedWallet.getTransactionCount()
            console.log("new transaction")
            console.log(newTx)
            console.log('*checking if wallet has enough funds*')
            console.log(formatEther(newTx.value))
            console.log(formatEther(await connectedWallet.getBalance()))
            if (formatEther(newTx.value) >= formatEther(await connectedWallet.getBalance())) {
                console.log('ERROR: insufficient funds')
                alert("ERROR: insufficient funds")
                avrgGas()
                return
            }

            const signer = new ethers.Wallet(connectedWallet.privateKey, provider)
            console.log("sending transaction...")
            signer.sendTransaction(tx).then((transaction) => {
                console.dir(transaction)
                alert("Finished transaction!")
                setTransactionDisplay(null)
              })
        } catch (ex) {
            console.log('ERROR:')
            console.log(ex)
            setTx({
                from: connectedWallet.address,
                to: "",
                value: "",
                gasLimit: "",
                gasPrice: ""
            })
            avrgGas()
            return
        }
        
    }

    const avrgGas = async () => {
        const avrgPrice = (await provider.getGasPrice()).toString()
        console.log("***avrgGas()***\nsetting average gas price in wei")
        console.log(avrgPrice)
        setTx(prevTx => ({... prevTx, gasPrice: avrgPrice}))
        setTx(prevTx => ({... prevTx, gasLimit: "2000000"}))
    }

    useEffect(() => {
        avrgGas()
    }, [])

    const styles = StyleSheet.create({
        textInput: {
            textAlign: 'center',
            margin: '1rem',
            padding: '.7rem',
            width: '60%',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: '#CCCCCC',
            borderRadius: '50px',
            fontSize: 'large'
        },
        text: {
            fontSize: 'larger'
        }
    })

    return (
        <View style={{justifyContent:"center", alignItems:"center"}}>
            <Text style={styles.text}>New Transaction</Text>
            <TextInput style={styles.textInput}
                placeholder='addresst to'
                onChangeText={newAddress => setTx(prevTx =>  ({... prevTx, to: newAddress}))}
                defaultValue={tx.to}
                editable
            />
            <>
                <TextInput style={styles.textInput}
                    placeholder='value'
                    onChangeText={newValue => setTx(prevTx => ({... prevTx, value: newValue}))}
                    defaultValue={tx.value}
                    editable
                />
                <Text style={styles.text}>Estimated gas price: <Text style={{fontWeight:'500'}}>{tx.gasPrice} wei</Text></Text>
                
                <TextInput style={styles.textInput}
                    placeholder="Gas limit in gwei"
                    onChangeText={newGasLimit => setTx(prevTx => ({... prevTx, gasLimit: newGasLimit}))}
                    defaultValue={tx.gasLimit}
                    editable
                />
                <Text style={{fontWeight:'400', fontSize:'larger'}}>Gas limit in gwei</Text>
                
            </>
            <View style={{width:'80%', flexDirection:'row', justifyContent:'space-around', marginTop:'2rem'}}>
                <Button title="Cancel" onPress={() => setTransactionDisplay(null)}/>
                <Button title="Continue" onPress={() => handleNewTransaction(tx)}/>
            </View>
        </View>
    )
}

const Transactions = (props) => {
    const { history, connectedWallet, provider, setHistory, refreshWalletHistory } = props
    const [display, setDisplay] = useState(null)
    return (
        <View style={{width: '100%'}}>
            { !display && (
                <>
                    <View style={{width:'100%', alignItems:'center'}}>
                        <Button title="new transaction" onPress={() => {setDisplay("new_transaction")}} />
                    </View>
                    <TransactionHistory style={{width: "90%"}} history={history} connectedWallet={connectedWallet} provider={provider}/>
                </>
            )}
            { display == "new_transaction" && (<NewTransaction setHistory={setHistory} refreshWalletHistory={refreshWalletHistory}setTransactionDisplay={setDisplay} connectedWallet={connectedWallet} provider={provider}/>) }
            
        </View>
    )
}

const Tokens = (props) => {
    
    return (
        <View>
            <Text>Tokens</Text>
        </View>
    )
}



const TransactionHistory = (props) => {
    const { history, connectedWallet } = props
    console.log("***transaction history***")
    console.log(history)
    console.log("***********************")


    const styles = StyleSheet.create({
        transactionItem: {
            padding: '.5rem',
            borderBottomColor: 'grey',
            borderBottomWidth: '2px',
            fontWeight:'600'
        },
        transactionText: {
            fontSize: '16px',
            fontWeight:'400'
        }
    })

    return (
        <View>
            
            {history?.map((tx, idx) => (
                <View key={idx} style={styles.transactionItem}>
                    { tx.from == connectedWallet.address ?
                        <>
                            <Text style={styles.transactionText}>Sended {formatEther(tx.value)} ETH to:</Text>
                            <Text style={styles.transactionText}>{tx.to}</Text>
                        </> :
                        <>
                            <Text style={styles.transactionText}>Received {formatEther(tx.value)} ETH from:</Text>
                            <Text style={styles.transactionText}>{tx.from}</Text>
                        </> }
                    <Text style={{fontSize:"14px"}}>{ new Date(tx.timestamp * 1000).toUTCString() }</Text>
                        
                </View>
            )
            )}
        </View>
        
    )

    
}

const refreshWalletHistory = async (props) => {
    const { walletProvider, pro, setHistory } = props
    console.log('***refresh wallet history***')
    await (await pro.getHistory(walletProvider.address).then((history) => {
        console.log(history)
        let newHistory = history.reverse().map((tx) => (tx))
        console.log({newHistory})
        setHistory(newHistory)
    }))
    
    
}

async function refreshWalletBalance(props) {
    const { walletProvider, coinChange, setBalance } = props
    console.log(props)
    console.log("***refresh wallet balance***")
    console.log(`checking balance of: ${walletProvider.address}`)
    let balance = (coinChange == 'eth' ? formatEther((await walletProvider.getBalance())) : formatUnits((await walletProvider.getBalance()), coinChange))
    console.log(`balance: ${balance} wei`)
    setBalance(balance)
}

const connectWalletProvider = async (props) => {
    const { currentWallet, pro, coinChange, setConnectedWallet, setBalance, setHistory } = props
    console.log("***connect wallet to provider***")
    const walletProvider = new ethers.Wallet(currentWallet.privateKey, pro)
    console.log('wallet provider')
    console.log(walletProvider)
    setConnectedWallet(walletProvider)
    await refreshWalletBalance({walletProvider, coinChange, setBalance})
    await refreshWalletHistory({walletProvider, pro, setHistory})
}

const handleNetworkChange = async (props) => {
    const { 
        currentWallet,
        network,
        coinChange,
        setNetwork,
        setProvider,
        setConnectedWallet,
        setBalance,
        setHistory
    } = props
    console.log('***handle network change***')
    setNetwork(network)
    const pro = new ethers.providers.EtherscanProvider(network, ["6XKVM2Y46S7RTKWTZTTQTUW3EHHG6GYCJ6"])
    console.log(`the provider is ${pro}`)
    setProvider(pro)
    await connectWalletProvider({currentWallet, pro, coinChange, setConnectedWallet, setBalance, setHistory})
}

const Header = (props) => {
    const { 
        network,
        balance,
        currentWallet,
        connectedWallet,
        coinChange,
        handleCoinChange,
        setNetwork,
        setBalance,
        setHistory,
        setConnectedWallet,
        handleLogged,
        deleteWallets,
        setProvider,
        setHomeDisplay } = props

    

    //const [signer, setSigner] = useState(null)

    return (
        <View style={{width: '100%', padding: '.5rem', paddingBottom: '0', borderBottomColor:"blue", borderBottomWidth:'2px'}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{margin: '1rem', fontSize:'large'}}>network</Text>
                <View style={{marginTop:'1.3rem'}}>
                    <RNPickerSelect
                        onValueChange={(network) => handleNetworkChange({currentWallet, network, setNetwork, setProvider, setConnectedWallet, setBalance, setHistory})}
                        value={network}
                        items={[
                            { label: "homestead", value: "homestead" },
                            { label: "ropsten", value: "ropsten" },
                            { label: "rinkeby", value: "rinkeby" },
                            { label: "goerli", value: "goerli" },
                            { label: "kovan", value: "kovan" },
                        ]}
                    />
                </View>
                
            </View>
            
            
            { currentWallet && 
            <>
                <Text style={{textAlign:'center', fontSize:'large'}}>wallet address</Text>
                <Text style={{textAlign:'center'}}>{currentWallet.address}</Text>
            </>
            }
            <View style={{flexDirection:'row'}}>
                <Text style={{margin:'1rem', fontSize:'large'}}>Balance in</Text>
                <View style={{marginTop:'1rem'}}>
                    <RNPickerSelect
                        onValueChange={(coinChange) => {handleCoinChange(coinChange)}}
                        value={coinChange}
                        items={[
                            { label: "eth", value: "eth" },
                            { label: "gwei", value: "gwei" },
                            { label: "mwei", value: "mwei" },
                            { label: "wei", value: "wei" },
                        ]}
                    />
                </View>
            </View>
            <Text style={{textAlign:"center", fontSize:"large"}}>{balance} {coinChange}</Text>
            <View style={{marginTop:'.2rem'}}>
                <Button title="Export Private Key" onPress={() => setHomeDisplay('export_pk')} />
                <Button title="remove credentials" onPress={deleteWallets} />
                <Button title="logout" onPress={() => handleLogged(false)} />
            </View>
        </View>
    )
}

const Home = (props) => {
    const { currentWallet, handleLogged, deleteWallets } = props
    const [display, setDisplay] = useState("transactions")
    const [history, setHistory] = useState([])
    
    const [connectedWallet, setConnectedWallet] = useState('')
    const [coinChange, setCoinChange] = useState('eth')

    const [provider, setProvider] = useState('')
    const [network, setNetwork] = useState("rinkeby")
    const [balance, setBalance] = useState("")


    const handleCoinChange = async (newCoin) => {
        console.log('***handle coin change***')
        setCoinChange(newCoin)
        const walletProvider = connectedWallet
        const coinChange = newCoin
        refreshWalletBalance({walletProvider, coinChange, setBalance})
    }

    useEffect(async () => {
        console.log('****going to handle first network change****')
        console.log(network)
        console.log(currentWallet)
        await handleNetworkChange({currentWallet, network, coinChange, setNetwork, setProvider, setConnectedWallet, setBalance, setHistory})
    }, [])

    

    return (
            <View key="homempage" style={styles.home}>
                <Header
                    currentWallet={currentWallet}
                    handleLogged={handleLogged}
                    balance={balance}
                    network={network}
                    coinChange={coinChange}
                    deleteWallets={deleteWallets}
                    setHistory={setHistory}
                    setNetwork={setNetwork}
                    setBalance={setBalance}
                    provider={provider}
                    setProvider={setProvider}
                    connectedWallet={connectedWallet}
                    setConnectedWallet={setConnectedWallet}
                    handleCoinChange={handleCoinChange}
                    setHomeDisplay={setDisplay}
                />
                { display == "export_pk" ?
                    <ExportPK connectedWallet={connectedWallet} setHomeDisplay={setDisplay}/> :
                    <View style={{width:'100%', marginBottom:'.5rem',flexDirection:'row', justifyContent:'space-around'}}>
                        <Button title="Transactions" onPress={() => setDisplay("transactions")} />
                        <Button title="Tokens" onPress={() => setDisplay("tokens")} />
                    </View>    
                }
                { display == "transactions" && <Transactions history={history} connectedWallet={connectedWallet} provider={provider} setHistory={setHistory}/> }
                { display == "tokens" && <Tokens /> }
                
            </View>
        
    )
}

const styles = StyleSheet.create({
    home: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: "white",
        position: "relative"
    }
})

export default Home