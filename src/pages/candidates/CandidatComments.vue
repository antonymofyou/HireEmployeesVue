<script setup>
import { ref, onMounted } from "vue";
import { MainRequestClass } from "@/js/RootClasses";
import CommentCard from "@/components/CommentCard.vue";

const props = defineProps({
  // ID вакансии, если передано - получаем комментарии для кандидата по отношению к отклику, иначе общие комментарии для кандидата
  vacancyId: {
    type: String,
    default: "",
  },
  // ID кандидата
  candidateId: {
    type: String,
    required: true,
  },
});

// Массив комментариев
const comments = ref([]);

const requestComments = () => {
  class CandidateGetCandidateComments extends MainRequestClass {
    commentFor = "";
    candidateId = "";
  }
  const requestInstance = new CandidateGetCandidateComments();

  // Формируем строку вида for_candidate или for_otklic:id
  requestInstance.commentFor = `for_${
    props.vacancyId ? "otklic:" + props.vacancyId : "candidate"
  }`;
  requestInstance.candidateId = props.candidateId;

  requestInstance.request(
    "/candidates/get_candidate_comments.php",
    "manager",
    (response) => {
      comments.value = response.comments;
    },
    (err) => {
      console.log(err);
    },
  );
};

onMounted(requestComments);
</script>

<template>
  <div class="comments">
    <template v-if="comments.length">
      <CommentCard
        v-for="{ comment, updatedAt, createdAt, id } in comments"
        :updatedAt
        :createdAt
        :key="id"
        class="comments_comment"
      >
        {{ comment }}
      </CommentCard>
    </template>
    <p v-else>Нет комментариев</p>
  </div>
</template>

<style scopred>
.comments_comment:not(:last-child) {
  margin-bottom: 10px;
}
</style>
