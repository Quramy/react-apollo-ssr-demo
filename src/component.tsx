import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const query = gql`
  query {
    products(count: 3) {
      id,
      name,
      price,
      relatedProducts(count: 2) {
        id,
        name,
      }
    }
  }
`;

const Component = () => {
  const { loading, data } = useQuery(query);
  return (
    <div>
      loading: {!!loading}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
};

export default Component;
