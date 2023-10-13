import { keccak256 } from 'js-sha3';

const verifyChecksum = (address) => {
  const addressHash = keccak256(address.toLowerCase());
    // console.log("verify before")
  for (let i = 0; i < 40; i += 1) {
    if (
      (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 6 && address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  // console.log("afterverify")
  return true;
};

const isValidAddress = (address) => {
  // Check if it has the basic requirements of an address
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return false;
  }

  // If it's all small caps or all all caps, return true
  if (/^0x[0-9a-f]{40}$/.test(address) || /^0x?[0-9A-F]{40}$/.test(address)) {
    return true;
  }

  // Otherwise check each case
  return verifyChecksum(address.replace(/^0x/, ''));
};

export default isValidAddress;