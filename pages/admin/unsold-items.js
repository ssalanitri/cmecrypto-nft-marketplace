/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { makeStyles } from "@material-ui/core/styles";

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const NFTMARKET_CONTRACT_ADDRESS = process.env.NFTMARKET_CONTRACT_ADDRESS;
const NETWORK = process.env.NETWORK;

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import CardAvatar from "../../components/Card/CardAvatar";
import { Button } from "@material-ui/core";
import Admin from "../layouts/Admin";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

function UnSoldItems() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // /* create a generic provider and query for unsold market items */
    // const provider = new ethers.providers.JsonRpcProvider();
    const web3Modal = new Web3Modal({
      network: NETWORK,
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const tokenContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT.abi,
      provider
    );
    const marketContract = new ethers.Contract(
      NFTMARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NFTMARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      NFT_CONTRACT_ADDRESS,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <div>
      <GridContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts.map((nft, i) => (
          <GridItem xs={12} sm={12} md={12} key={i} className="">
            <Card plain>
              <CardAvatar profile>
                <Image
                  src={nft.image}
                  alt={nft.name}
                  height="150px"
                  width="130px"
                />
                <CardBody className="p-4 text-center text-lg">
                  <p>{nft.name}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </Button>
                </CardBody>
              </CardAvatar>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </div>
  );
}

UnSoldItems.layout = Admin;

export default UnSoldItems;
