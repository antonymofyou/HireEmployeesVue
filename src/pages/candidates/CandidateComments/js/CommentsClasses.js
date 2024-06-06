import { MainRequestClass } from '@/js/RootClasses';

export class CandidatesSetCandidateComment extends MainRequestClass {
  candidateId = '';
  action = '';
  commentFor = '';
  commentId = '';
  commentText = '';
}

export class CandidateGetCandidateComments extends MainRequestClass {
  commentFor = '';
  candidateId = '';
}
