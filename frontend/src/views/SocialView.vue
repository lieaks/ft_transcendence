<script setup lang="ts">
import searchComponent from '@/components/searchComponent.vue'
import { ref, type Ref } from 'vue'

type IRelation = 'blocked' | 'blockedOf' | 'friends' | 'friendOf'
interface IRelations {
  name: string
  relation: IRelation
}
const relations: IRelations[] = [
  { name: 'Following', relation: 'friends' },
  { name: 'Followers', relation: 'friendOf' },
  { name: 'Blocked', relation: 'blocked' },
  { name: 'Blocked you', relation: 'blockedOf' }
]
const currentRelation: Ref<IRelation> = ref('friends')
</script>

<template>
  <div class="inline-flex m-4 h-full">
    <div class="w-auto h-full text-center mr-4 flex items-center">
      <ul class="menu rounded-box w-full whitespace-nowrap menu-lg">
        <template v-for="relation in relations">
          <li class="my-2">
            <a
              :class="{ active: currentRelation === relation.relation }"
              @click="currentRelation = relation.relation"
            >
              {{ relation.name }}
            </a>
          </li>
        </template>
      </ul>
    </div>
    <div class="w-auto mx-4">
      <searchComponent :relation="currentRelation" :key="currentRelation" />
    </div>
  </div>
</template>
