"use client"
import "../style/faucetCss.css"
import {ethers} from "ethers"; 
import {useState} from 'react'; 
import Web3Modal from 'web3modal'; 
import WalletConnectProvider from "@walletconnect/web3-provider";
import { contractAddress, abi } from "../constants";


let web3Modal;
let provider;
 

const providerOptions = {
    walletconnect:{
        package: WalletConnectProvider,
        options :{
           rpc :{97: process.env.BSC_TESTNET_URL },
            
        }
    } 
}
export default function Web3ModalBscFaucet(){

const [contractBalance, setContractBalance] = useState(); 
const [isConnected, setIsConnected] = useState(false); 
const[showUserAddress, setUserAddress] = useState(); 
const[showBalance, setBalance] = useState(); 
const [divRequestActive, setDivRequestActive] = useState(false); 
const [requestBnbTxHash, setRequestBnbTxHash] = useState(); 
const [isLoaderActive, setLoaderActive] = useState(false); 
const [divTxCompleted, setDivTxCompleted] = useState(false); 
const [numberOfConfirmations, setNumberOfConfirmations] = useState(); 
const [numberOfTimePeopleHaveBeenFunded, setNumberofTimePeopleHaveBeenFunded] = useState(); 
const [timeWhenClaimining, setTimeWhenClaiming] = useState(false); 
const [writeUserCantClaim, setWriteUserCantClaim] = useState(false); 

async function connect(){ 
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, 
    
})
provider = await web3Modal.connect();
setIsConnected(true); 
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner();
const user = await signer.getAddress();

const firstThree = user.slice(0,5); 
const lastThree = user.slice(-3); 

setUserAddress(firstThree.toString()+ "..." + lastThree.toString() ); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
 const getContractBalance = await contract.contractBalance(); 
setBalance((getContractBalance / 1e18).toString()); 
const getNumberofTimeUsersHaveBeenFunded = await contract.seeNumberOfPeopleFunded(); 
setNumberofTimePeopleHaveBeenFunded(getNumberofTimeUsersHaveBeenFunded.toString()); 
}

 
  async function requestBNB(){
    const timeBeforeClaiming = Date.now(); 
  //  if(timeBeforeClaiming - timeWhenClaimining >= 360000){
  //   console.log("User can withdraw"); 
  //   }else{
  //     console.log("User can't withdraw")
  //   }
   //const currentTime = Date.now(); 
    if(isConnected == true && timeBeforeClaiming - timeWhenClaimining >= 3600000){
      
      web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions, 
      })
      const _timeWhenClaimining = Date.now(); 
      
      try{
        const ethersProvider = new ethers.providers.Web3Provider(provider); 
        const signer = ethersProvider.getSigner();
        const user = await signer.getAddress();
        const firstThree = user.slice(0,5); 
        const lastThree = user.slice(-3); 

        setUserAddress(firstThree.toString()+ "..." + lastThree.toString() ); 
        const contract = new ethers.Contract(contractAddress, abi, signer); 
        const giveBnb = await contract.withdrawToFundUsers(user.toString(),(ethers.utils.parseEther("0.0001"))); 
       setTimeWhenClaiming(_timeWhenClaimining); 
       setWriteUserCantClaim(false); 
        const getNumberofTimeUsersHaveBeenFunded = await contract.seeNumberOfPeopleFunded(); 
       setNumberofTimePeopleHaveBeenFunded(getNumberofTimeUsersHaveBeenFunded.toString()); 
      
        setDivRequestActive(true); 
        setRequestBnbTxHash(giveBnb.hash); 
        setLoaderActive(true); 
         const waitForRewardingUser = await giveBnb.wait(1); 
        setLoaderActive(false); 
        setDivRequestActive(false); 

        setDivTxCompleted(true); 
        setNumberOfConfirmations(waitForRewardingUser.confirmations); 
        // const getNumberofTimeUsersHaveBeenFunded = await contract.seeNumberOfPeopleFunded(); 
        // setNumberofTimePeopleHaveBeenFunded(getNumberofTimeUsersHaveBeenFunded); 
        
        
      }catch(e){
console.log("oops something went wrong.."); 
setWriteUserCantClaim(true); 
      }
    }else{
     setWriteUserCantClaim(true); 
    }
   



  }
 

  async function closeRequestDiv(){
    setDivRequestActive(false)
  }
  async function closeTcConfirmedDiv(){
    setDivTxCompleted(false); 
  }


 
return(
  <>
{isConnected? 
  <>
{divRequestActive? <> 
<div className = "contenitorePadreDivRequest">
  <div className = "padreDivRequest">
    <div className= "contenitoreClose">
      <button className = "closeButton"onClick = {() => closeRequestDiv()} >Close</button>
    </div>
    <div className = "writeJoiningAtTxHash">Claiming bnb at tx hash:</div>
    <div className = "contenitoreSrcittaTxHash">
    <div className = "requestBnbTxHash">{requestBnbTxHash}</div>
    </div>
    {isLoaderActive? <><div className = "contenitoreLoader"><div className = "loader"></div></div> </> : <> </>}
  </div>
</div>
</> : <> </> }
{divTxCompleted? <> 
<div className = "contenitorePadreDivTxCompleted">
<div className = "padreDivTxCompleted">
<div className= "contenitoreClose">
      <button className = "closeButton" onClick = {() => closeTcConfirmedDiv()}>Close</button>
    </div>
<div className = "writeTxCompleted">Tx completed with {numberOfConfirmations} confirmation/s</div>
<div className = "contenitoreSpuntaBlu">
  <div className = "spuntaBlu"></div>
</div>
</div>
</div>
</>: <> </> }
<div className = "contenitoreTwitterButtonDanielEth">




  <div className = "buttonDiv">
    <a href = "https://twitter.com/0xDaniel_eth" className = "ahrefTwitter">
    <div className = "photoTwitter"></div>
<div className = "writeDanielEthTwitter">Daniel.eth</div>
</a>
  </div>


</div>
<div className = "contenitoreTitolo">
  <div className = "immagineAcqua"></div><div className = "titolo">Bsc-testnet Faucet</div>
</div>
<div className = "writeBscTestnetOnly">Note: This is a BSC testnet faucet only</div>
<div className = "writeBnbChain">Make shure to use the bsc testnet network!</div>
<div className = "youCanAccessDownBelow">You can access this faucet down below!</div>
<div className = "contenitoreConnectedButton">
  <button className = "connectedButton">Connected to {showUserAddress}</button>
</div>
<div className = "contenitoreFotoBscEScrittaBalance">
<div className = "photoBsc"></div><div className = "writeFaucetContractBalance">FAUCET BALANCE: {showBalance} BNB</div>
</div>
<div className = "contenitoreRequestBnb">
<button className = "requestBnbButton" onClick = {() => requestBNB()}>Request 0.001 BNB</button>
</div>
{writeUserCantClaim? <><div className = "userCantClaim">User already claimed one time in the last hour</div></> 


: <> </>}
<div className = "peopleFundedWrite">Number of time people have been funded: </div>
<div className = "numberOfTimePeopleHaveBeenFunded">{numberOfTimePeopleHaveBeenFunded}</div>
<div className = "backedBy">Backed by</div>
<div className = "contentitoreSpuntaBluEDaniel">
  <div className = "spuntaBluu"></div><div className = "danielEth">Daniel.eth</div>
</div>
  </>
  : 

<> 
<div className = "contenitoreTwitterButtonDanielEth">




  <div className = "buttonDiv">
    <a href = "https://twitter.com/0xDaniel_eth" className = "ahrefTwitter">
    <div className = "photoTwitter"></div>
<div className = "writeDanielEthTwitter">Daniel.eth</div>
</a>
  </div>


</div>
<div className = "contenitoreTitolo">
<div className = "immagineAcqua"></div><div className = "titolo">Bsc-testnet Faucet</div>
</div>
<div className = "writeBscTestnetOnly">Note: This is a BSC testnet faucet only</div>
<div className = "writeBnbChain">Make shure to use the bsc testnet network!</div>
<div className = "writeQuestionYouNeedBnb">You need some extra bnb testnet to develope you're project and make some tests? </div>
<div className = "writePleaseConnectWallet">Please connect a wallet to get accesss to the faucet</div>
<div className = "contenitoreConnectButton">
<button className = "connectButton" onClick = {() => connect()}>Connect wallet </button>

</div>
<div className = "backedBy">Backed by</div>
<div className = "contentitoreSpuntaBluEDaniel">
  <div className = "spuntaBluu"></div><div className = "danielEth">Daniel.eth</div>
</div>
</>



}
  </>
)
}