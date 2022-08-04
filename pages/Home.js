import { ethers } from "ethers";
import { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils";

const Tab = createMaterialTopTabNavigator();

const NewTransaction = (props) => {
    const { setTransactionDisplay } = props
    return (
        <View>
            <Text>New Transaction</Text>
            <Button title="Cancel" onPress={() => setTransactionDisplay(null)}/>
            <Button title="Continue" onPress={() => console.log("making transaction?")}/>
        </View>
    )
}

const Transactions = (props) => {
    const { history, currentWallet } = props
    const [display, setDisplay] = useState(null)
    console.log(`history at Transactions...`)
    console.log(history)
    return (
        <View style={{width: '100%'}}>
            { !display && (
                <>
                    <Button title="new transaction" onPress={() => {setDisplay("new_transaction")}} />
                    <TransactionHistory style={{width: "90%"}} history={history} currentWallet={currentWallet} />
                </>
            )}
            { display == "new_transaction" && (<NewTransaction setTransactionDisplay={setDisplay} />) }
            
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
    const { history, currentWallet } = props
    console.log("***transaction history***")
    console.log(history)
    history.map((tx) => { console.log(tx.from); console.log(tx.to) } )
    console.log("***********************")


    const styles = StyleSheet.create({
        transactionItem: {
            padding: '.5rem',
            paddingLeft: '1rem',
            borderBottomColor: 'grey',
            borderBottomWidth: '2px'
        },
        transactionText: {
            fontSize: '16px',   
        }
    })

    return (
        <View>
            
            {history?.map((tx, idx) => (
                <View key={idx} style={styles.transactionItem}>
                    { tx.from == currentWallet.address ?
                        <>
                            <Text style={styles.transactionText}>Sended {formatEther(tx.value)} ETH</Text>
                            <Text style={styles.transactionText}>to: {tx.to}</Text>
                        </> :
                        <>
                            <Text style={styles.transactionText}>Received {formatEther(tx.value)} ETH</Text>
                            <Text style={styles.transactionText}>from {tx.from}</Text>
                        </> }
                        <Text style={styles.transactionText}>date: { new Date(tx.timestamp * 1000).toUTCString() }</Text>
                </View>
            )
            )}
        </View>
        
    )

    
}

const refreshWalletHistory = async (props) => {
    const { walletProvider, setHistory, pro } = props
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
    console.log("***refresh wallet balance***")
    console.log(`checking balance of: ${walletProvider.address}`)
    let balance = (coinChange == 'eth' ? formatEther((await walletProvider.getBalance())) : formatUnits((await walletProvider.getBalance()), coinChange))
    console.log(balance)
    setBalance(balance)
}

const connectWalletProvider = async (props) => {
    const { currentWallet, pro, coinChange, setConnectedWallet, setBalance, setHistory } = props
    console.log("***connect wallet to provider***")
    const walletProvider = new ethers.Wallet(currentWallet.privateKey, pro)
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
    setProvider(pro)
    await connectWalletProvider({currentWallet, pro, coinChange, setConnectedWallet, setBalance, setHistory})
}

const Header = (props) => {
    const { currentWallet, setHistory, handleLogged, deleteWallets } = props
    const [network, setNetwork] = useState("rinkeby")
    const [balance, setBalance] = useState("")
    const [coinChange, setCoinChange] = useState('wei')

    const [provider, setProvider] = useState(null)
    const [connectedWallet, setConnectedWallet] = useState(null)
    //const [signer, setSigner] = useState(null)

    useEffect(async () => {
        await handleNetworkChange({currentWallet, network, coinChange, setNetwork, setProvider, setConnectedWallet, setBalance, setHistory})
    }, [])
    
    const handleCoinChange = async (newCoin) => {
        console.log('***handle coin change***')
        setCoinChange(newCoin)
        const walletProvider = connectedWallet
        const coinChange = newCoin
        refreshWalletBalance({walletProvider, coinChange, setBalance})
    }


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
                <Button title="remove credentials" onPress={deleteWallets} />
                <Button title="logout" onPress={() => handleLogged(false)} />
            </View>
        </View>
    )
}

const Home = (props) => {
    const { currentWallet, wallets, setCurrentWallet, setWallets, handleLogged, deleteWallets } = props
    const [display, setDisplay] = useState("transactions")
    const [history, setHistory] = useState([])

    return (
        <View key="homempage" style={styles.home}>
            <Header
                currentWallet={currentWallet}
                handleLogged={handleLogged}
                deleteWallets={deleteWallets}
                setHistory={setHistory}
            />
            <Button title="Transactions" onPress={() => setDisplay("transactions")} />
            <Button title="Tokens" onPress={() => setDisplay("tokens")} />
            { display == "transactions" ? <Transactions history={history} currentWallet={currentWallet} /> : null }
            { display == "tokens" ? <Tokens /> : null }
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: "white"
    }
})

export default Home