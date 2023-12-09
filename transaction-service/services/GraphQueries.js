const { GraphQLClient, gql } = require("graphql-request");
const { SUBGRAPH_URL } = require("../constants");

const client = new GraphQLClient(SUBGRAPH_URL, { headers: {} });

async function queryPendingOrders(blockTimestamp) {
  try {
    const pendingOrders = gql`
        query {
          orders(first: 4, skip: ${0}, where:{open: true , startAt_lte: "${blockTimestamp}" }, orderBy: startAt orderDirection: asc ) {
            id
            amount
            executed
            fromToken
            user
            toToken
            startAt
            price
            orderId
            orderHash
            open
            isBuy
          }
        }`;

    const results = await client.request(pendingOrders);
    return results?.orders;
  } catch (error) {
    console.log("queryPendingOrders error: ", error);
    return [];
  }
}

module.exports = { queryPendingOrders };
