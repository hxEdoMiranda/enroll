export const dynamic = "force-dynamic"
import { getQuestionnaires } from "@/modules/questionnaires/actions/questionnaires";
import { QuestionnairesTable } from "./components/QuestionnairesTable";
import { ClipboardPenLine } from "lucide-react";
import { AddQuestionnaireButton } from "@/modules/questionnaires/components/add-questionnaire-button";

export default async function QuestionnairesPage() {
  const questionnairesData = await getQuestionnaires();

  return (
    <main className="flex flex-col gap-4 p-8 bg-white">
      <div className="bg-[url('/img/shared/background-banner.png')] bg-cover bg-center bg-no-repeat relative h-24 rounded-xl mb-4 flex flex-col gap-1 items-start justify-center px-8">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <ClipboardPenLine className="size-10 text-white mr-2" />
            <h1 className="text-white font-bold text-3xl">Cuestionarios</h1>
          </div>
          <AddQuestionnaireButton />
        </div>
      </div>
      {questionnairesData.ok && (
        <QuestionnairesTable data={questionnairesData.data!} />
      )}
    </main>
  );
}
