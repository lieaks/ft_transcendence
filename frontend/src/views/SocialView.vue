<script setup lang="ts">
import searchComponent from '@/components/searchComponent.vue'
import { ref, type Ref } from 'vue'

type IRelation = 'blocked' | 'blockedOf' | 'friends' | 'friendOf'
interface IRelations {
  name: string
  relation: IRelation
}
const relations: IRelations[] = [
  { name: 'Followers', relation: 'friends' },
  { name: 'Following', relation: 'friendOf' },
  { name: 'Blocked', relation: 'blocked' },
  { name: 'Blocked you', relation: 'blockedOf' }
]
const currentRelation: Ref<IRelation> = ref('friends')
</script>

<template>
  <div class="inline-flex m-4">
    <div class="w-auto h-screen text-center mr-4 flex items-center">
      <ul class="menu rounded-box w-full whitespace-nowrap menu-lg">
        <template v-for="relation in relations">
          <li>
            <a @click="currentRelation = relation.relation">{{ relation.name }} </a>
          </li>
        </template>
      </ul>
    </div>
    <div class="w-auto overflow-scroll h-screen mx-4">
      <searchComponent :relation="currentRelation" :key="currentRelation" />
    </div>
  </div>
</template>
