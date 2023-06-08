import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gql } from 'graphql-tag'
import { apolloClient } from '@/main'

const CHIREL_QUERY = gql`
  query {
    chirel
  }
`;

const CHIREL_MUTATION = gql`
	mutation {
		notLoveChirel
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
		} catch (err) {}
  }

  async function notLoveChirel() {
		try {
			const response = await apolloClient.mutate({
				mutation: CHIREL_MUTATION
			});
			chirel.value = response.data.notLoveChirel;
		} catch (err) {}
	}

  function getChirelData() {
	return chirel.value;
  }

  return {
    fetchChirelData,
	notLoveChirel,
	getChirelData
  }
});
