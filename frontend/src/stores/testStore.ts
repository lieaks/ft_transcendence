import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gql } from 'graphql-tag'
import { apolloClient } from '@/main'

const CHIREL_QUERY = gql`
  query {
    chirel
  }
`;

export const useTestStore = defineStore('test', () => {
  const chirel = ref(null);

  async function fetchChirelData() {
    try {
      const response = await apolloClient.query({
        query: CHIREL_QUERY
      });
      chirel.value = response.data.chirel;
	  console.log("chirelData.value: " + chirel.value);
    } catch (err) {}
  }

  function getChirelData() {
	return chirel.value;
  }

  return {
    fetchChirelData,
	getChirelData
  }
});
