"use server";

import { getQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { QuestionnaireForm } from "../components/QuestionnaireForm";
import { AddQuestionButton } from "../components/AddQuestionButton";
import { Questions } from "../components/Questions";
import { ClipboardPenLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Groups } from "../components/Groups";
import { QuestionnaireProvider } from "./components/QuestionnaireProvider";
import { AddGroupForm } from "./components/AddGroupForm";
import { AddGroupButton } from "./components/AddGroupButton";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetServerSideProps } from 'next';


// export default async function Page({ params }: { params: { id: string } }) {
//   const questionnaireData = await getQuestionnaireById({ id: params.id });

//   if (!questionnaireData.ok || !questionnaireData.data) {
//     throw new Error("Ocurrió un error");
//   }

//   const uuid = uuidv4();

//   return (
//     <QuestionnaireProvider
//       defaultQuestionnaire={questionnaireData.data}
//       key={uuid}
//     >
//       <main className="flex flex-col gap-4 p-8 h- bg-white">
//         <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
//           <div className="flex justify-between w-full">
//             <div className="flex gap-2 items-center">
//               <ClipboardPenLine className="size-10 text-white mr-2" />
//               <h1 className="text-white font-bold text-3xl">{questionnaireData.data.title}</h1>
//             </div>
//           </div>
//         </div>
//         <QuestionnaireForm
//           questionnaireId={questionnaireData.data?.uid}
//           defaultValues={{
//             title: questionnaireData.data?.title,
//             description: questionnaireData.data?.description,
//           }}
//         />
//         <div className="flex justify-between mb-2">
//           <h1 className="text-xl font-bold ml-2">Preguntas</h1>
//           <div className="flex gap-2">
//             <AddQuestionButton />
//             <AddGroupButton />
//           </div>
//         </div>
//         {
//           <Questions
//             key={questionnaireData.data?.questions.length}
//             questionnaireId={questionnaireData.data?.uid}
//             questions={questionnaireData?.data!.questions.filter(
//               (question) => !("groupId" in question)
//             )}
//           />
//         }
//         {questionnaireData?.data?.groups && (
//           <Groups
//             key={questionnaireData.data.groups.length}
//             questionnaireId={questionnaireData.data?.uid}
//           />
//         )}

//         <Dialog>
//           <DialogHeader>
//             <DialogTitle hidden>Agregar grupo al cuestionario</DialogTitle>
//           </DialogHeader>
//           <DialogTrigger asChild>
//             <Button
//               variant="outline"
//               className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Agregar nuevo grupo
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <AddGroupForm />
//           </DialogContent>
//         </Dialog>
//       </main>
//     </QuestionnaireProvider>
//   );
// }

interface PageProps {
  params: {
    id: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  return {
    props: {
      params: { id },
    },
  };
};

export default async function Page({ params }: PageProps) {
  const questionnaireData = await getQuestionnaireById({ id: params.id });

  if (!questionnaireData.ok || !questionnaireData.data) {
    throw new Error("Ocurrió un error");
  }

  const uuid = uuidv4();

  return (
    <QuestionnaireProvider
      defaultQuestionnaire={questionnaireData.data}
      key={uuid}
    >
      <main className="flex flex-col gap-4 p-8 h- bg-white">
        <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              <ClipboardPenLine className="size-10 text-white mr-2" />
              <h1 className="text-white font-bold text-3xl">{questionnaireData.data.title}</h1>
            </div>
          </div>
        </div>
        <QuestionnaireForm
          questionnaireId={questionnaireData.data?.uid}
          defaultValues={{
            title: questionnaireData.data?.title,
            description: questionnaireData.data?.description,
          }}
        />
        <div className="flex justify-between mb-2">
          <h1 className="text-xl font-bold ml-2">Preguntas</h1>
          <div className="flex gap-2">
            <AddQuestionButton />
            <AddGroupButton />
          </div>
        </div>
        {
          <Questions
            key={questionnaireData.data?.questions.length}
            questionnaireId={questionnaireData.data?.uid}
            questions={questionnaireData?.data!.questions.filter(
              (question) => !("groupId" in question)
            )}
          />
        }
        {questionnaireData?.data?.groups && (
          <Groups
            key={questionnaireData.data.groups.length}
            questionnaireId={questionnaireData.data?.uid}
          />
        )}

        <Dialog>
          <DialogHeader>
            <DialogTitle hidden>Agregar grupo al cuestionario</DialogTitle>
          </DialogHeader>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar nuevo grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddGroupForm />
          </DialogContent>
        </Dialog>
      </main>
    </QuestionnaireProvider>
  );
}