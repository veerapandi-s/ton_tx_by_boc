const { Cell } = require('@ton/ton');
const axios = require('axios');

const data = {
    "boc": "te6cckECFwEAA6wAA+OIAAKeA/KcTgTX0RXqA2WW7/cQQCHFQdFBfMin9TIR3mdmEZPJBg/2pqNRMl+o34hYuiKJEi5qV4Eqt+Iyuy5Ugb20npI06/HIUutwvbJxe/lcUuJUh7bhdwgHBQGjT2lZJwAFNTRi/////+AAAAAAAHADAgEAaEIAKbYfmNguOmCvgg2Y91twFYYKxCLhBMPtfpx6DVw1oR2gCYloAAAAAAAAAAAAAAAAAAAAUQAAAAApqaMXf1sd/hiOErzaCkZxX3sGI3yVo4+ypfb3x6pvO0AO2UdAART/APSkE/S88sgLBAIBIAoFBPjygwjXGCDTH9Mf0x8C+CO78mTtRNDTH9Mf0//0BNFRQ7ryoVFRuvKiBfkBVBBk+RDyo/gAJKTIyx9SQMsfUjDL/1IQ9ADJ7VT4DwHTByHAAJ9sUZMg10qW0wfUAvsA6DDgIcAB4wAhwALjAAHAA5Ew4w0DpMjLHxLLH8v/CQgHBgAK9ADJ7VQAbIEBCNcY+gDTPzBSJIEBCPRZ8qeCEGRzdHJwdIAYyMsFywJQBc8WUAP6AhPLassfEss/yXP7AABwgQEI1xj6ANM/yFQgR4EBCPRR8qeCEG5vdGVwdIAYyMsFywJQBs8WUAT6AhTLahLLH8s/yXP7AAIAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwICAUgUCwIBIA0MAFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQCASAPDgARuMl+1E0NcLH4AgFYExACASASEQAZrx32omhAEGuQ64WPwAAZrc52omhAIGuQ64X/wAA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYALm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDRYVAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+IAeAH6APQEMPgnbyIwUAqhIb7y4FCCEHBsdWeDHrFwgBhQBMsFJs8WWPoCGfQAy2kXyx9SYMs/IMmAQPsABm2G6KU="
};

const API_BASE_URL = 'https://testnet.tonapi.io/v2/events/';

const getTransactionHash = (boc) => {
    const cell = Cell.fromBase64(boc);
    return cell.hash().toString('hex');
};

const fetchTransactionDetails = async (hash) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${hash}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction details:', error.message);
        return null;
    }
};

const extractTonTransfer = (actions) => {
    const tonTransfer = actions.find(action => action.type === 'TonTransfer');
    if (!tonTransfer) return null;

    const { sender, recipient, amount } = tonTransfer.TonTransfer;
    return {
        sender: sender.address,
        receiver: recipient.address,
        amount
    };
};

const init = async () => {
    try {
        const hash = getTransactionHash(data.boc);
        console.log("Transaction Hash:", hash);

        const transactionData = await fetchTransactionDetails(hash);
        if (!transactionData) return "API Error";

        if (!transactionData.actions || transactionData.actions.length === 0) {
            return "No Actions";
        }

        const transferDetails = extractTonTransfer(transactionData.actions);
        if (!transferDetails) return "No TonTransfer found";

        console.log("TonTransfer Details:", transferDetails);
        return transferDetails;

    } catch (error) {
        console.error("Unexpected error:", error.message);
        return "Unexpected Error";
    }
};

init().then(result => {
    if (typeof result === 'string') {
        console.log("Result:", result);
    }
});