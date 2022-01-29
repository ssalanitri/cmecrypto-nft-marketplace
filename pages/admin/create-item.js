/* pages/create-item.js */
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useStyles from "../../styles/useStyles";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import Admin from "../layouts/Admin";
import RegularButton from "../../components/CustomButtons/Button";
import CustomCard from "../../components/Card/CustomCard";

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const NFTMARKET_CONTRACT_ADDRESS = process.env.NFTMARKET_CONTRACT_ADDRESS;
const INFURA_URL = process.env.INFURA_URL;
const NETWORK = process.env.NETWORK;

const client = ipfsHttpClient(INFURA_URL);

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.up("md")]: {
      justifyContent: "center",
    },
  },
}));

function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(`url: ${url}`);
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarketItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = INFURA_URL + "/" + added.path;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal({
      network: NETWORK,
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(
      NFTMARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );
    await transaction.wait();
    router.push("/");
  }

  <button type="button" className="bg-indigo-500 ..." disabled>
    <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
      {/* <!-- ... --> */}
    </svg>
    Processing...
  </button>;

  const gridStyles = useGridStyles();
  const styles = useStyles({
    color: "#203f52",
  });

  return (
    <Grid container>
      <Grid
        container
        item
        xs={6}
        direction="column"
        spacing={2}
        className="flex justify-center"
      >
        <Grid item className="w-1/2 flex flex-col pb-12">
          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
        </Grid>
        <Grid item className="w-1/2 flex flex-col pb-12">
          <TextField
            id="standard-basic"
            label="Description"
            variant="standard"
            placeholder="NFT Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
        </Grid>
        <Grid item className="w-1/2 flex flex-col pb-12">
          <TextField
            id="standard-basic"
            label="Price"
            variant="standard"
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
        </Grid>
        <Grid item className="w-1/2 flex flex-col pb-12">
          <RegularButton variant="contained" component="label">
            Upload File
            <input
              id="contained-button-file"
              type="file"
              hidden
              className="my-4 block"
              onChange={onChange}
            />
          </RegularButton>
        </Grid>
        <Grid item className="w-1/2 flex flex-col pb-12">
          <RegularButton variant="contained" onClick={createMarketItem}>
            Create NFT
          </RegularButton>
        </Grid>
      </Grid>
      <Grid classes={gridStyles} container spacing={4} wrap={"nowrap"}>
        {fileUrl && (
          <CustomCard
            classes={styles}
            title={NFT.name}
            subtitle={NFT.price}
            image={NFT.image}
          />
        )}
      </Grid>
    </Grid>
  );
}

CreateItem.layout = Admin;

export default CreateItem;
