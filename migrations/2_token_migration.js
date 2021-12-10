const NFTGameToken = artifacts.require("NFTGameToken");

module.exports = async function (deployer) {
  await deployer.deploy(NFTGameToken);
  // let tokenInstance = await Token.deployed();
  // await tokenInstance.createCaracter();
  // console.log(await tokenInstance.getCaracterDetails(0));
};
