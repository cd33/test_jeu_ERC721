import React, { useState, useEffect } from "react";
import NFTGameToken from "./contracts/NFTGameToken.json";
import getWeb3 from "./getWeb3";
import * as s from "./globalStyles";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [nftgContract, setNftgContract] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [typeCharacter, setTypeCharacter] = useState(0);
  const [myCharacters, setMyCharacters] = useState(null);
  const [allCharacters, setAllCharacters] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        if (window.ethereum) {
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccounts({ accounts });
            window.location.reload();
          });

          window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
        }

        const networkId = await web3.eth.net.getId();
        if (networkId !== 1337 && networkId !== 42) {
          alert("Please Switch to the Kovan Network");
          return;
        }

        // Load NFTGameToken and the NFTs
        const nftgNetwork = NFTGameToken.networks[networkId];
        const nftgContract = new web3.eth.Contract(NFTGameToken.abi, nftgNetwork && nftgNetwork.address);
        setNftgContract(nftgContract);
        let myCharacters = await nftgContract.methods.getMyCharacters().call({ from: accounts[0] });
        setCharacters(myCharacters)
        // setCharacters(myCharacters);

        // Subscribe to the contract states to update the front states
        web3.eth.subscribe('newBlockHeaders', async (err, res) => {
          if (!err) {
            await nftgContract.methods.getMyCharacters().call({ from: accounts[0] }).then(res => setCharacters(res));
          }
        });
        
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };
    init();
  }, []);

  // useEffect(() => {
  //   if (web3 && contract && accounts) {
      
  //   }
  // }, [web3, contract, accounts])

  // console.log(web3)
  // console.log(contract)
  // console.log(accounts)

  const createCharacter = async () => {
    await nftgContract.methods.createCharacter(typeCharacter)
    .send({ from: accounts[0], value: "1000000000000000" })
    // .once(err => console.log(err))
    // .then(receipt => console.log(receipt))
  }

  const getMyCharacters = async () => {
    try {
      const result = await nftgContract.methods.getMyCharacters().call({ from: accounts[0] });
      setMyCharacters(result);
    } catch(error) {
      console.log(error.message)
    }
  }

  console.log("myCharacters", myCharacters)

  const getAllCharacters = async () => {
    try {
      const result = await nftgContract.methods.getAllCharacters().call();
      setAllCharacters(result);
    } catch(error) {
      console.log(error.message)
    }
  }

  console.log("allCharacters", allCharacters)

  const typeCharacterName = (val) => {
    if (parseInt(val) === 0) {
      return "BERSERKER"
    } else if (parseInt(val) === 1) {
      return "SPIRITUAL"
    } else {
      return "ELEMENTARY"
    }
  }

  return (
    <s.Screen>
      <s.Container ai="center" style={{flex: 1, backgroundColor: '#DBAD6A'}}>
        {!web3 ? 
          <div><s.TextTitle>Loading Web3, accounts, and contract...</s.TextTitle></div>
        :
        <>
        { accounts && <div style={{position: "absolute", right: 10, top: 0}}>{accounts[0]}</div> }

        <s.TextTitle>Début projet final Alyra</s.TextTitle>

        <s.TextDescription>Veuillez choisir un type de personnage</s.TextDescription>
        <s.SpacerSmall />
        <select onChange={e => setTypeCharacter(e.target.value)}>
          <option value="0">BERSERKER</option>
          <option value="1">SPIRITUAL</option>
          <option value="2">ELEMENTARY</option>
        </select>
        <s.SpacerSmall />
        <button onClick={(e) => {
          e.preventDefault();
          createCharacter();
        }}>CREATE CHARACTER</button>
        <s.SpacerSmall />
        <button onClick={(e) => {
          e.preventDefault();
          getMyCharacters();
        }}>TEST MY CHARACTER</button>
        <s.SpacerSmall />
        <button onClick={(e) => {
          e.preventDefault();
          getAllCharacters();
        }}>TEST ALL CHARACTER</button>

        {!characters && <s.TextSubTitle>Créez votre premier NFT</s.TextSubTitle>}

        <s.SpacerMedium />

        <s.Container fd="row" style={{flexWrap:"wrap"}}>
          {characters && characters.length > 0 &&
            characters.map(Character => {
              return (
                <><s.Container key={Character.id} style={{minWidth: "130px"}}>
                  {/* <s.TextDescription>ID: {Character.id}</s.TextDescription> */}
                  {/* <s.TextDescription>DNA: {Character.dna}</s.TextDescription> */}
                  <s.TextDescription>XP: {Character.xp}</s.TextDescription>
                  <s.TextDescription>HP: {Character.hp}</s.TextDescription>
                  <s.TextDescription>Attack: {Character.attack}</s.TextDescription>
                  <s.TextDescription>Armor: {Character.armor}</s.TextDescription>
                  <s.TextDescription>Mana: {Character.mana}</s.TextDescription>
                  <s.TextDescription>Magic Resistance: {Character.magicResistance}</s.TextDescription>
                  <s.TextDescription>Type: {typeCharacterName(Character.typeCharacter)}</s.TextDescription>
                </s.Container>
                <s.SpacerSmall /></>
              )
            })
          }
          
        </s.Container>
        </>}
      </s.Container>
    </s.Screen>
  )
}

export default App;
