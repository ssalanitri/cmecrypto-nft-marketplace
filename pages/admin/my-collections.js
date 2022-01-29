import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useStyles from "../../styles/useStyles";

import axios from "axios";
import Web3Modal from "web3modal";
import Admin from "../layouts/Admin";
import CustomCard from "../../components/Card/CustomCard";

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const NFTMARKET_CONTRACT_ADDRESS = process.env.NFTMARKET_CONTRACT_ADDRESS;
const NETWORK = process.env.NETWORK;

import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.up("md")]: {
      justifyContent: "center",
    },
  },
}));

function MyCollections() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: NETWORK,
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      NFTMARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );
    const tokenContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT.abi,
      provider
    );
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price =
          "Price:" +
          ethers.utils.formatUnits(i.price.toString(), "ether") +
          " ETH";
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  const gridStyles = useGridStyles();
  const styles = useStyles({
    color: "#203f52",
  });

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;
  return (
    <Grid classes={gridStyles} container spacing={4} wrap={"nowrap"}>
      {nfts.map((nft, i) => (
        <Grid key={i}>
          <CustomCard
            classes={styles}
            title={nft.name}
            subtitle={nft.price}
            image={nft.image}
          />
        </Grid>
      ))}
    </Grid>
  );
}

MyCollections.layout = Admin;

export default MyCollections;
