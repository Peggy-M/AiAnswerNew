<template>
  <div class="practice">
    <h2>练习中心</h2>
    <div class="practice-types">
      <el-row :gutter="20">
        <el-col :span="8" v-for="type in practiceTypes" :key="type.id">
          <el-card class="practice-card" @click="startPractice(type.id)">
            <h3>{{ type.name }}</h3>
            <p>{{ type.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const practiceTypes = ref([
  {
    id: 1,
    name: '智能练习',
    description: 'AI根据你的学习情况推荐练习题'
  },
  {
    id: 2,
    name: '错题练习',
    description: '针对性复习曾经做错的题目'
  },
  {
    id: 3,
    name: '自由练习',
    description: '自由选择题型和难度进行练习'
  }
])

const startPractice = (typeId: number) => {
  console.log('开始练习:', typeId)
}
</script>

<style scoped lang="scss">
.practice {
  padding: 20px;
  
  h2 {
    margin-bottom: 20px;
  }
  
  .practice-types {
    .practice-card {
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      }
      
      h3 {
        margin-bottom: 10px;
      }
      
      p {
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style> 