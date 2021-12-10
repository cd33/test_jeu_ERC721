import React, { useState, useEffect } from "react";
import NFTGameToken from "./contracts/NFTGameToken.json";
import getWeb3 from "./getWeb3";
import * as s from "./globalStyles";
import Navbar from "./components/Navbar";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [owner, setOwner] = useState(null);
  const [nftgContract, setNftgContract] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [typeCharacter, setTypeCharacter] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [myCharacters, setMyCharacters] = useState(null);
  const [othersCharacters, setOthersCharacters] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        web3.eth.handleRevert = true;

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
        await nftgContract.methods.getMyCharacters().call({ from: accounts[0] }).then(res => setCharacters(res));
        await nftgContract.methods.getOthersCharacters().call({ from: accounts[0] }).then(res => setOthersCharacters(res));

        setOwner(accounts[0] === await nftgContract.methods.owner().call());

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

  // EVENTS
  // useEffect(() => {
  //   if (bibscoin !== null && web3 !== null) {
  //     bibscoin.events.Transfer({fromBlock: 0})
  //     .on('data', event => handleModal("Transaction Approuved", `${web3.utils.fromWei((event.returnValues.value).toString(), 'Ether')} DAI transfered`))
  //     .on('error', err => alert("Error", err.message))
  //   }
  // }, [bibscoin, web3])

  const createCharacter = () => {
    setLoading(true);
    nftgContract.methods.createCharacter(typeCharacter)
    .send({ from: accounts[0], value: web3.utils.toWei("1", 'Ether') })
    .once("error", err => {
      setLoading(false);
      console.log(err);
    })
    .then(receipt => {
      setLoading(false);
      console.log(receipt);
    })
  }

  const withdraw = () => {
    setLoading(true);
    nftgContract.methods.withdraw().send({ from: accounts[0] })
    .then(res => {
      setLoading(false);
      console.log(res);
    })
  }

  const fight = (_myTokenId, _rivalTokenId) => {
    setLoading(true);
    nftgContract.methods.fight(_myTokenId, _rivalTokenId)
    .send({ from: accounts[0], value: web3.utils.toWei("0.001", 'Ether') })
    .then(res => {
      setLoading(false);
      console.log(res);
    })
  }

  const heal = (_myTokenId) => {
    setLoading(true);
    nftgContract.methods.heal(_myTokenId)
    .send({ from: accounts[0], value: web3.utils.toWei("0.001", 'Ether') })
    .then(res => {
      setLoading(false);
      console.log(res);
    })
  }

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
          <s.TextTitle>Loading Web3, accounts, and contract...</s.TextTitle>
        : <>
        <Navbar accounts={accounts} />

        <s.TextTitle>Début projet final Alyra</s.TextTitle>
        <s.TextSubTitle>Veuillez choisir un type de personnage</s.TextSubTitle>
        <s.SpacerSmall />

        <select onChange={e => setTypeCharacter(e.target.value)}>
          <option value="0">BERSERKER</option>
          <option value="1">SPIRITUAL</option>
          <option value="2">ELEMENTARY</option>
        </select>

        <s.Button 
          disabled={loading ? 1 : 0} 
          onClick={() => createCharacter()} 
          primary={loading ? "" : "primary"} 
        >
          CREATE CHARACTER
        </s.Button>
        
        <s.TextTitle style={{margin: 0}}>Mes Persos</s.TextTitle>

        {!characters && <s.TextSubTitle>Créez votre premier NFT</s.TextSubTitle>}

        <s.Container fd="row" style={{flexWrap:"wrap"}}>
          {characters && characters.length > 0 &&
            characters.map(character => {
              return (
                <><s.Container key={character.id} style={{minWidth: "130px"}}>
                  <s.TextDescription>ID: {character.id}</s.TextDescription>
                  {/* <s.TextDescription>DNA: {character.dna}</s.TextDescription> */}
                  <s.TextDescription>XP: {character.xp}</s.TextDescription>
                  <s.TextDescription>HP: {character.hp}</s.TextDescription>
                  <s.TextDescription>Attack: {character.attack}</s.TextDescription>
                  <s.TextDescription>Armor: {character.armor}</s.TextDescription>
                  <s.TextDescription>Mana: {character.mana}</s.TextDescription>
                  <s.TextDescription>Magic Resistance: {character.magicResistance}</s.TextDescription>
                  <s.TextDescription>Type: {typeCharacterName(character.typeCharacter)}</s.TextDescription>
                  { character.xp < 100 && 
                    <s.Button 
                      disabled={loading ? 1 : 0} 
                      onClick={() => heal(character.id)} 
                      primary={loading ? "" : "primary"} 
                    >
                      HEAL
                    </s.Button>
                  }
                </s.Container>
                <s.SpacerSmall /></>
              )
            })
          }
        </s.Container>

        <s.SpacerLarge />
        <s.TextTitle style={{margin: 0}}>Mes Ennemis</s.TextTitle>

        <s.Container fd="row" style={{flexWrap:"wrap"}}>
          {othersCharacters && othersCharacters.length > 0 &&
            othersCharacters.map(character => {
              return (
                <><s.Container key={character.dna} style={{minWidth: "130px"}}>
                  <s.TextDescription>ID: {character.id}</s.TextDescription>
                  {/* <s.TextDescription>DNA: {character.dna}</s.TextDescription> */}
                  <s.TextDescription>XP: {character.xp}</s.TextDescription>
                  <s.TextDescription>HP: {character.hp}</s.TextDescription>
                  <s.TextDescription>Attack: {character.attack}</s.TextDescription>
                  <s.TextDescription>Armor: {character.armor}</s.TextDescription>
                  <s.TextDescription>Mana: {character.mana}</s.TextDescription>
                  <s.TextDescription>Magic Resistance: {character.magicResistance}</s.TextDescription>
                  <s.TextDescription>Type: {typeCharacterName(character.typeCharacter)}</s.TextDescription>
                  <s.Button 
                    disabled={loading ? 1 : 0} 
                    onClick={() => fight(1, character.id)} 
                    primary={loading ? "" : "primary"} 
                  >
                    FIGHT
                  </s.Button>
                </s.Container>
                <s.SpacerSmall /></>
              )
            })
          }
        </s.Container>
        </>}
        { owner && 
          <s.Button 
            disabled={loading ? 1 : 0} 
            onClick={() => withdraw()} 
            primary={loading ? "" : "primary"} 
          >
            WITHDRAW
          </s.Button>
        }
      </s.Container>
    </s.Screen>
  )
}

export default App;
